import {SendBuffer} from '../lib/SendBuffer';
import {ReqID} from '../request/AbstractRequest';
import {RecvID} from '../response/AbstractResponse';
import {AbstractEventListener} from './AbstractEventListener';

export class SystemEventListener extends AbstractEventListener<string, {}> {
	public reqId = ReqID.ID_SUB_SYSTEM_EVENT;
	public resId = RecvID.ID_EVENT_FRAME;
	protected handleReqWrite(send: SendBuffer): void {
        send.putInt(this.channelId);
        send.putString(this.reqPayload, 256);
	}
	protected handleResWrite(send: SendBuffer): void {
		throw new Error('Method not implemented.');
	}
}

