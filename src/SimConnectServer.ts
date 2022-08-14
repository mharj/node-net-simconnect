import {Server, createServer, Socket} from 'net';
import {ReadBuffer} from './lib/ReadBuffer';
import {SendBuffer} from './lib/SendBuffer';
import {RequestFactory} from './request/RequestFactory';
import {OpenResponsePacket} from './response/OpenResponsePacket';
import {QuitResponsePacket} from './response/QuitResponsePacket';
import {ProtocolVersion} from '.';
import {ReqID} from './request/AbstractRequest';
import {LoggerLike} from './lib/loggerLike';
import {FrameEventResponse} from './response/events/FrameEventResponse';
import {TextType} from './types/TextType';
import {ISubSystemEventRequestPayload} from './request/SubscribeToSystemEvent';

export interface IServerProps {
	port: number;
	name: string;
	logger?: LoggerLike;
}

function handleSystemEvents(payload: ISubSystemEventRequestPayload, socket: Socket, buffer: SendBuffer, protoVersion: ProtocolVersion) {
	const {clientEventID, name} = payload;
	switch (name) {
		case 'Frame': {
			new FrameEventResponse({frameRate: 60, simSpeed: 1}, {channelId: clientEventID, groupdId: undefined, eventData: 0}).write(buffer, protoVersion);
			socket.write(buffer.getBuffer());
		}
	}
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
				this.props.logger?.debug('SCS: close client socket');
				this.clients.delete(socket);
			});
			socket.on('data', this.handleMessage(socket));
		});
		this.handleMessage = this.handleMessage.bind(this);
	}
	public listen() {
		this.props.logger?.info(`SCS: listen ${this.props.port}`);
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
		this.props.logger?.info(`SCS: closed`);
	}
	private handleMessage(socket: Socket) {
		return (data: Buffer) => {
			const buff = new ReadBuffer(data);
			const packets = RequestFactory.from(buff);
			for (const {packet} of packets) {
				this.props.logger?.debug(`SCS: handle '${ReqID[packet.packetId]}'`);
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
					case ReqID.ID_SUB_SYSTEM_EVENT: {
						handleSystemEvents(packet.data(), socket, this.buffer, this.protoVersion);
						break;
					}
					case ReqID.text: {
						const {type, message} = packet.data();
						this.props.logger?.info(`(${TextType[type]}): ${message}`);
					}
				}
			}
		};
	}
}
