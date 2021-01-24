import * as EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import {Socket} from 'net';
import {ReadBuffer} from './lib/ReadBuffer';
import {OpenRequestPacket} from './request/OpenRequestPacket';
import {SendBuffer} from './lib/SendBuffer';
import {ResponseFactory} from './response/ResponseFactory';
import {OpenResponsePacket} from './response/OpenResponsePacket';
import {IOpenPayload} from './response/QuitResponsePacket';
import {RecvID} from './response/AbstractResponse';
import {LoggerLike} from './lib/loggerLike';

interface ClientEvents {
	open: (data: IOpenPayload) => void;
	close: (wasError: boolean) => void;
	error: (error: Error) => void;
	data: (payload: ReturnType<typeof ResponseFactory.from>) => void;
}

interface IClientProps {
	hostname: string;
	port: number;
	name: string;
	proto: 2 | 3 | 4;
	logger?: LoggerLike | undefined;
}

export class SimConnectClient extends (EventEmitter as new () => TypedEmitter<ClientEvents>) {
	private sendBuffer: SendBuffer;
	private packetIndex = 1;
	private props: IClientProps;
	private client: undefined | Socket;
	private isOpenSent = false;
	constructor(props: IClientProps) {
		super();
		this.sendBuffer = new SendBuffer();
		this.props = props;
		this.handleConnected = this.handleConnected.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handlePacket = this.handlePacket.bind(this);
	}
	public connect(): void {
		this.client = new Socket();
		this.client.connect(this.props.port, this.props.hostname, this.handleConnected);
		this.client.on('data', this.handlePacket);
		this.client.on('connect', this.handleConnected);
		this.client.on('close', this.handleClose);
		this.client.on('error', this.handleError);
	}

	private handleConnected() {
		// connect gets called twice, ensure we only send Open once
		if (this.client && this.client.writable && !this.isOpenSent) {
			this.isOpenSent = true;
			new OpenRequestPacket({
				name: this.props.name,
				appVerMajor: 10,
				appVerMinor: 0,
				appBuildMajor: 1234,
				appBuildMinor: 0,
			}).write(this.sendBuffer, this.props.proto, this.packetIndex++);
			this.client.write(this.sendBuffer.getBuffer());
		}
	}
	private handleError(error: Error) {
		this.emit('error', error);
	}
	private handleClose(wasError: boolean) {
		this.emit('close', wasError);
	}
	private handlePacket(data: Buffer) {
		const buff = new ReadBuffer(data);
		const packet = ResponseFactory.from(buff);
		this.props.logger && this.props.logger.debug(`packet ${packet.packetId}`);
		switch (packet.packetId) {
			case RecvID.ID_OPEN: {
				this.emit('open', (packet as OpenResponsePacket).data());
			}
			default:
				this.emit('data', packet);
		}
	}
}
