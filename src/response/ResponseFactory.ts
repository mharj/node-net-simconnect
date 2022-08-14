import {ReadBuffer} from '../lib/ReadBuffer';
import {RecvID} from './AbstractResponse';
import {ErrorResponsePacket} from './ErrorResponsePacket';
import {FrameEventResponse} from './events/FrameEventResponse';
import {OpenResponsePacket} from './OpenResponsePacket';
import {QuitResponsePacket} from './QuitResponsePacket';

export type ResPacketTypes = ErrorResponsePacket | OpenResponsePacket | QuitResponsePacket | FrameEventResponse;

export class ResponseFactory {
	public static from(buff: ReadBuffer): ResPacketTypes[] {
		const packets: ResPacketTypes[] = [];
		buff.position(0);
		while (buff.position() < buff.length()) {
			let startPos = buff.position();
			const headers = this.readHeaders(buff);
			switch (headers.id) {
				case RecvID.EXCEPTION: {
					packets.push(ErrorResponsePacket.from(buff));
					break;
				}
				case RecvID.OPEN: {
					packets.push(OpenResponsePacket.from(buff));
					break;
				}
				case RecvID.QUIT: {
					packets.push(QuitResponsePacket.from(buff));
					break;
				}
				case RecvID.EVENT_FRAME: {
					packets.push(FrameEventResponse.from(buff));
					break;
				}
				default:
					throw new Error('unknown res packet id: ' + headers.id);
			}
			if (startPos + headers.size !== buff.position()) {
				throw new Error(`wrong packet size on ${RecvID[headers.id]} size: ${headers.size} read: ${buff.position() - startPos}`);
			}
		}
		return packets;
	}
	private static readHeaders(buff: ReadBuffer) {
		return {
			size: buff.getInt(),
			protocol: buff.getInt(),
			id: buff.getInt() & 0x0fffffff,
		};
	}
}
