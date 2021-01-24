import {ReadBuffer} from '../lib/ReadBuffer';
import {RecvID} from './AbstractResponse';
import {ErrorResponsePacket} from './ErrorResponsePacket';
import {OpenResponsePacket} from './OpenResponsePacket';
import {QuitResponsePacket} from './QuitResponsePacket';

export class ResponseFactory {
	public static from(buff: ReadBuffer) {
		const headers = this.readHeaders(buff);
		switch (headers.id) {
			case RecvID.ID_EXCEPTION: {
				return ErrorResponsePacket.from(buff);
			}
			case RecvID.ID_OPEN: {
				return OpenResponsePacket.from(buff);
			}
			case RecvID.ID_QUIT: {
				return QuitResponsePacket.from(buff);
			}
			default:
				throw new Error('unknown res packet id: ' + headers.id);
		}
	}
	private static readHeaders(buff: ReadBuffer) {
		buff.position(0);
		return {
			size: buff.getInt(),
			protocol: buff.getInt(),
			id: buff.getInt() & 0x0fffffff,
		};
	}
}
