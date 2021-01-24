import {ReadBuffer} from '../lib/ReadBuffer';
import {ReqID} from './AbstractRequest';
import {OpenRequestPacket} from './OpenRequestPacket';

export class RequestFactory {
	public static from(buff: ReadBuffer) {
		const headers = this.readHeaders(buff);
		switch (headers.id) {
			case ReqID.ID_OPEN: {
				return OpenRequestPacket.from(buff);
			}
			default:
				throw new Error('unknown req packet id: ' + headers.id);
		}
	}
	private static readHeaders(buff: ReadBuffer) {
		buff.position(0);
		return {
			size: buff.getInt(),
			protocol: buff.getInt(),
			id: buff.getInt() & 0x0fffffff,
			index: buff.getInt(),
		};
	}
}
