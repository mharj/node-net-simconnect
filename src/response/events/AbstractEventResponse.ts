import {ProtocolVersion} from '../..';
import {UNKNOWN_GROUP} from '../../lib/consts';
import {ReadBuffer} from '../../lib/ReadBuffer';
import {SendBuffer} from '../../lib/SendBuffer';
import {AbstractResponse, RecvID, RESPONSE_HEADER_SIZE} from '../AbstractResponse';

export interface EventPayload<R extends RecvID, Payload extends any> {
	packetId: RecvID;
	channelId: number;
	groupId: number | undefined;
	eventData: number;
	payload: Payload;
}

export interface IEventOptions {
	channelId: number;
	groupdId: number | undefined;
	eventData: number;
}

export abstract class AbstractEventResponse<R extends RecvID, D extends {}> extends AbstractResponse<R, D> {
	protected static getEventHeader(buff: ReadBuffer): IEventOptions {
		const groupId = buff.getUInt();
		return {
			groupdId: groupId === UNKNOWN_GROUP ? undefined : groupId,
			channelId: buff.getInt(),
			eventData: buff.getInt(),
		};
	}
	public channelId: number;
	public groupId: number | undefined; // UNKNOWN_GROUP
	public eventData: number;

	constructor(payload: D, {channelId, groupdId, eventData}: IEventOptions) {
		super(payload);
		this.channelId = channelId;
		this.groupId = groupdId;
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
		send.putUInt(this.groupId === undefined ? UNKNOWN_GROUP : this.groupId);
		send.putInt(this.channelId);
		send.putInt(this.eventData);
	}
	public getEvent(): EventPayload<R, D> {
		return {
			packetId: this.packetId,
			channelId: this.channelId,
			groupId: this.groupId,
			eventData: this.eventData,
			payload: this.payload,
		};
	}
}
