import * as EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import {Socket} from 'net';
import {ReadBuffer} from './lib/ReadBuffer';
import {IOpenRequestPayload, OpenRequestPacket} from './request/OpenRequestPacket';
import {SendBuffer} from './lib/SendBuffer';
import {ResponseFactory} from './response/ResponseFactory';
import {OpenResponsePacket} from './response/OpenResponsePacket';
import {IOpenPayload} from './response/QuitResponsePacket';
import {RecvID} from './response/AbstractResponse';
import {LoggerLike} from './lib/loggerLike';
import {RequestFactory} from './request/RequestFactory';
import {ReqID} from './request/AbstractRequest';
import {EventResponse, isEventResponse} from './response/events';

interface ClientEvents {
	open: (data: IOpenPayload) => void;
	close: (wasError: boolean) => void;
	error: (error: Error) => void;
	data: (payload: ReturnType<typeof ResponseFactory.from>) => void;
	event: (packet: EventResponse) => void;
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

	private handleConnected() {
		// connect gets called twice, ensure we only send Open once
		if (!this.isOpenSent) {
			this.connectPromiseResolve?.();
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
			this.sendPacket(new OpenRequestPacket(payload));
		}
	}
	private sendPacket(packet: ReturnType<typeof RequestFactory.from>) {
		if (this.client && this.client.writable) {
			packet.write(this.sendBuffer, this.props.proto, this.packetIndex++);
			this.props.logger?.debug(`send packet '${ReqID[packet.packetId]}'`);
			this.client.write(this.sendBuffer.getBuffer());
		}
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
		const packet = ResponseFactory.from(buff);
		this.props.logger && this.props.logger.debug(`recv packet '${RecvID[packet.packetId]}'`);
		switch (packet.packetId) {
			case RecvID.ID_OPEN: {
				this.emit('open', (packet as OpenResponsePacket).data());
				this.emit('data', packet);
				break;
			}
			case RecvID.ID_EXCEPTION: {
				this.props.logger && this.props.logger.error('Exception', packet.data());
				break;
			}
			case RecvID.ID_EVENT_FRAME: {
				if (isEventResponse(packet)) {
					this.emit('event', packet);
				}
				break;
			}
			default:
				this.emit('data', packet);
		}
	}
}
