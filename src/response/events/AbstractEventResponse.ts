import {ProtocolVersion} from '../..';
import {UNKNOWN_GROUP} from '../../lib/consts';
import {ReadBuffer} from '../../lib/ReadBuffer';
import {SendBuffer} from '../../lib/SendBuffer';
import {AbstractResponse, RecvID, RESPONSE_HEADER_SIZE} from '../AbstractResponse';


export interface IEventOptions {
	channelId: number;
	groupdId: number | undefined;
	eventData: number;
}

export abstract class AbstractEventResponse<D = {}> extends AbstractResponse<RecvID, D> {
	public packetId = RecvID.ID_EVENT_FRAME;
	protected static getEventHeader(buff: ReadBuffer): IEventOptions {
		const groupId = buff.getUInt();
		return {
			groupdId: groupId === UNKNOWN_GROUP ? undefined : groupId,
			channelId: buff.getInt(),
			eventData: buff.getInt(),
		};
	}
	public channelId: number;
	public groupdId: number | undefined; // UNKNOWN_GROUP
	public eventData: number;

	constructor(payload: D, {channelId, groupdId, eventData}: IEventOptions) {
		super(payload);
		this.channelId = channelId;
		this.groupdId = groupdId;
		this.eventData = eventData;
	}
	public write(send: SendBuffer, protocol: ProtocolVersion) {
		send.reset(); // clear pos and size
		send.position(RESPONSE_HEADER_SIZE);
		this.setEventHeaders(send);
		this.handleWrite(send);
		this.writeHeader(send, protocol);
	}
	private setEventHeaders(send: SendBuffer) {
		send.putUInt(this.groupdId === undefined ? UNKNOWN_GROUP : this.groupdId);
		send.putInt(this.channelId);
		send.putInt(this.eventData);
	}
}
