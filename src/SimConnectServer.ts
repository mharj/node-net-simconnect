import {Server, createServer, Socket} from 'net';
import {ReadBuffer} from './lib/ReadBuffer';
import {SendBuffer} from './lib/SendBuffer';
import {RequestFactory} from './request/RequestFactory';
import {OpenResponsePacket} from './response/OpenResponsePacket';
import {QuitResponsePacket} from './response/QuitResponsePacket';
import {ProtocolVersion} from '.';
import {ReqID} from './request/AbstractRequest';
import {LoggerLike} from './lib/loggerLike';

export interface IServerProps {
	port: number;
	name: string;
	logger?: LoggerLike | undefined;
}

export class SimConnectServer {
	private clients = new Set<Socket>();
	private buffer: SendBuffer;
	private props;
	private server: Server;
	private protoVersion: ProtocolVersion = 4;
	constructor(props: IServerProps) {
		this.props = props;
		this.buffer = new SendBuffer();
		this.server = createServer((socket) => {
			this.clients.add(socket);
			socket.on('end', () => {
				this.clients.delete(socket);
			});
			socket.on('data', this.handleMessage(socket));
		});
		this.handleMessage = this.handleMessage.bind(this);
	}
	public listen() {
		this.props.logger && this.props.logger.info(`SimConnect server listen ${this.props.port}`);
		this.server.listen(this.props.port);
	}
	public close() {
		new QuitResponsePacket(undefined).write(this.buffer, this.protoVersion);
		const quitBuff = this.buffer.getBuffer();
		for (const client of this.clients) {
			if (client.writable) {
				client.write(quitBuff);
			}
		}
		this.server.close();
		this.props.logger && this.props.logger.info(`SimConnect server closed`);
	}
	private handleMessage(socket: Socket) {
		return (data: Buffer) => {
			const buff = new ReadBuffer(data);
			const packet = RequestFactory.from(buff);
			this.props.logger && this.props.logger.debug(`handle packet ${packet.packetId}`);
			switch (packet.packetId) {
				case ReqID.ID_OPEN: {
					new OpenResponsePacket({
						name: this.props.name,
						appVerMajor: 10,
						appVerMinor: 0,
						appBuildMajor: 1234,
						appBuildMinor: 0,
						simConVerMajor: 10,
						simConVerMinor: 0,
						simConBuildMajor: 1234,
						simConBuildMinor: 0,
						reserved1: 0,
						reserved2: 0,
					}).write(this.buffer, this.protoVersion);
					socket.write(this.buffer.getBuffer());
					break;
				}
			}
		};
	}
}
