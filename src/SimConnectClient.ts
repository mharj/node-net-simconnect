import * as EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import {Socket} from 'net';
import {ReadBuffer} from './lib/ReadBuffer';
import {IOpenRequestPayload, Open} from './request/Open';
import {SendBuffer} from './lib/SendBuffer';
import {ResPacketTypes, ResponseFactory} from './response/ResponseFactory';
import {OpenResponsePacket} from './response/OpenResponsePacket';
import {IOpenPayload} from './response/QuitResponsePacket';
import {RecvID} from './response/AbstractResponse';
import {LoggerLike} from './lib/loggerLike';
import {ReqPacketTypes} from './request/';
import {ReqID} from './request/AbstractRequest';
import {AnyEvent, isEventResponse} from './response/events';
import {SubscribeToSystemEvent} from './request/SubscribeToSystemEvent';
import {ITextPayload, Text} from './request/Text';
import {SystemEventName} from './types/SystemEventName';
import {AddToDataDefinition, IAddToDataDefinitionPayload} from './request/AddToDataDefinition';
import {OptionalExceptFor} from './types/helpper';
import {IRequestDataOnSimObjectPayload, RequestDataOnSimObject} from './request/RequestDataOnSimObject';

interface ClientEvents {
	open: (data: IOpenPayload) => void;
	close: (wasError: boolean) => void;
	error: (error: Error) => void;
	data: (payload: ResPacketTypes) => void;
	event: (e: AnyEvent) => void;
}

interface IClientProps {
	hostname: string;
	port: number;
	name: string;
	proto: 2 | 3 | 4;
	logger?: LoggerLike | undefined;
}
export const SIMCONNECT_BUILD_SP0 = 60905;
export const SIMCONNECT_BUILD_SP1 = 61355;
export const SIMCONNECT_BUILD_SP2_XPACK = 61259;

export class SimConnectClient extends (EventEmitter as new () => TypedEmitter<ClientEvents>) {
	private sendBuffer: SendBuffer;
	private packetIndex = 1;
	private props: IClientProps;
	private client: undefined | Socket;
	private isOpenSent = false;
	private connectPromise: Promise<void> | undefined;
	private connectPromiseResolve: undefined | ((value: void | PromiseLike<void>) => void) = undefined;
	private connectPromiseReject: undefined | ((reason?: any) => void) = undefined;
	constructor(props: IClientProps) {
		super();
		this.sendBuffer = new SendBuffer();
		this.props = props;
		this.handleConnected = this.handleConnected.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handlePacket = this.handlePacket.bind(this);
	}
	public connect(): Promise<void> {
		if (!this.connectPromise) {
			this.connectPromise = new Promise((resolve, reject) => {
				this.connectPromiseResolve = resolve;
				this.connectPromiseReject = reject;
			});
			this.client = new Socket();
			this.client.connect(this.props.port, this.props.hostname, this.handleConnected);
			this.client.on('data', this.handlePacket);
			this.client.on('connect', this.handleConnected);
			this.client.on('close', this.handleClose);
			this.client.on('error', this.handleError);
		}
		return this.connectPromise;
	}

	public close(): void {
		if (this.client) {
			this.client.destroy();
		}
	}

	private async handleConnected(): Promise<void> {
		// connect gets called twice, ensure we only send Open once
		if (!this.isOpenSent) {
			this.isOpenSent = true;
			let payload: IOpenRequestPayload;
			switch (this.props.proto) {
				case 2: {
					payload = {
						name: this.props.name,
						appVerMajor: 0,
						appVerMinor: 0,
						appBuildMajor: SIMCONNECT_BUILD_SP0,
						appBuildMinor: 0,
					};
					break;
				}
				case 3: {
					payload = {
						name: this.props.name,
						appVerMajor: 10,
						appVerMinor: 0,
						appBuildMajor: SIMCONNECT_BUILD_SP1,
						appBuildMinor: 0,
					};
					break;
				}
				case 4: {
					payload = {
						name: this.props.name,
						appVerMajor: 10,
						appVerMinor: 0,
						appBuildMajor: SIMCONNECT_BUILD_SP2_XPACK,
						appBuildMinor: 0,
					};
					break;
				}
				default:
					throw new Error('wrong payload number');
			}
			await this.sendPacket(new Open(payload));
		}
	}
	public subscribeToSystemEvent(clientEventID: number, name: SystemEventName): Promise<void> {
		return this.sendPacket(new SubscribeToSystemEvent({clientEventID, name}));
	}

	public Text(payload: ITextPayload) {
		this.sendPacket(new Text(payload));
	}

	public addToDataDefinition(data: OptionalExceptFor<IAddToDataDefinitionPayload, 'defineID' | 'datumName' | 'unitsName' | 'datumType'>): Promise<void> {
		return this.sendPacket(new AddToDataDefinition({fEpsilon: 0, datumID: -1, ...data}));
	}

	public requestDataOnSimObject(data: OptionalExceptFor<IRequestDataOnSimObjectPayload, 'requestID' | 'defineID' | 'objectID' | 'period'>): Promise<void> {
		return this.sendPacket(new RequestDataOnSimObject({flags: 0, origin: 0, interval: 0, limit: 0, ...data}));
	}

	public requestClientData(
		clientDataID: number,
		dataRequestID: number,
		clientDataDefineID: number,
		period: number,
		flags: number,
		origin: number,
		interval: number,
		limit: number,
	) {
		// TODO: implement
	}

	private sendPacket(packet: ReqPacketTypes): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.client && this.client.writable) {
				this.sendBuffer.reset();
				packet.write(this.sendBuffer, this.props.proto, this.packetIndex++);
				this.props.logger?.debug(`SCC: send '${ReqID[packet.packetId]}'`);
				this.client.write(this.sendBuffer.getBuffer(), (err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			}
		});
	}

	private handleError(error: Error) {
		this.connectPromiseReject?.(error);
		this.connectPromise = undefined;
		this.emit('error', error);
	}
	private handleClose(wasError: boolean) {
		this.connectPromise = undefined;
		this.emit('close', wasError);
	}
	private handlePacket(data: Buffer) {
		const buff = new ReadBuffer(data);
		const packets = ResponseFactory.from(buff);
		for (const packet of packets) {
			this.props.logger?.debug(`SCC: recv packet '${RecvID[packet.packetId]}'`);
			switch (packet.packetId) {
				case RecvID.OPEN: {
					this.emit('open', (packet as OpenResponsePacket).data());
					this.connectPromiseResolve?.();
					break;
				}
				case RecvID.EXCEPTION: {
					this.props.logger && this.props.logger.error('Exception', packet.data());
					break;
				}
				case RecvID.EVENT_FRAME: {
					if (isEventResponse(packet)) {
						this.emit('event', packet.getEvent());
					}
					this.emit('data', packet);
					break;
				}
				default:
					this.emit('data', packet);
			}
		}
	}
}
