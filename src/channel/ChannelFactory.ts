// import {ReadBuffer} from '../lib/ReadBuffer';


/* export class ChannelFactory {
	public static fromReq(buff: ReadBuffer) {
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
    public static fromRes(buff: ReadBuffer) {
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
	private static readChannelHeaders(buff: ReadBuffer) {
		buff.position(0);
		return {
			groupId: buff.getInt(),
			eventID: buff.getInt(),
			data: buff.getInt(),
		};
	}
} */
