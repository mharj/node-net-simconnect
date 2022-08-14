import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {TextType} from '../types/TextType';
import {AbstractRequest, ReqID} from './AbstractRequest';

export interface ITextPayload extends Record<string, unknown> {
	type: TextType;
	timeout: number;
	eventId: number;
	message: string;
}

/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/General/SimConnect_Text.htm?agt=index
 */
export class Text extends AbstractRequest<ReqID.text, ITextPayload> {
	get packetId(): ReqID.text {
		return ReqID.text;
	}
	public static from(buff: ReadBuffer) {
		return new Text({
			type: buff.getInt(),
			timeout: buff.getFloat(),
			eventId: buff.getInt(),
			message: buff.getString(buff.getInt()),
		});
	}
	protected handleWrite(send: SendBuffer): void {
		const {type, timeout, eventId, message} = this.payload;
		send.putInt(type);
		send.putFloat(timeout);
		send.putInt(eventId);
		send.putInt(message.length + 1);
		send.putString(message, message.length + 1);
	}
}
