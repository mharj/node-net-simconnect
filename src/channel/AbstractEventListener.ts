import {ProtocolVersion} from '..';
import {SendBuffer} from '../lib/SendBuffer';
import {ReqID, REQUEST_HEADER_SIZE} from '../request/AbstractRequest';
import {RecvID, RESPONSE_HEADER_SIZE} from '../response/AbstractResponse';

export abstract class AbstractEventListener<P = unknown, D = {}> {
	public abstract reqId: ReqID;
	public abstract resId: RecvID;
	protected channelId: number;
	protected reqPayload: P;
	protected resPayload: D | undefined;

	constructor(channelId: number, data: P) {
		this.channelId = channelId;
		this.reqPayload = data;
	}
	protected abstract handleReqWrite(send: SendBuffer): void;
	protected abstract handleResWrite(send: SendBuffer): void;
	private writeReqHeader(buff: SendBuffer, protocol: ProtocolVersion, index: number) {
		const size = buff.position();
		buff.position(0);
		buff.putInt(size);
		buff.putInt(protocol);
		buff.putInt(0xf0000000 | this.reqId);
		buff.putInt(index);
	}
	private writeResHeader(buff: SendBuffer, protocol: ProtocolVersion) {
		const size = buff.position();
		buff.position(0);
		buff.putInt(size);
		buff.putInt(protocol);
		buff.putInt(this.resId);
	}
	public writeReq(send: SendBuffer, protocol: ProtocolVersion, index: number) {
		send.reset(); // clear pos and size
		send.position(REQUEST_HEADER_SIZE);
		this.handleReqWrite(send);
		this.writeReqHeader(send, protocol, index);
	}
	public writeRes(send: SendBuffer, protocol: ProtocolVersion, index: number) {
		send.reset(); // clear pos and size
		send.position(RESPONSE_HEADER_SIZE);
		this.handleResWrite(send);
		this.writeResHeader(send, protocol);
	}
}
