import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {SimConnectPeriod} from '../types/SimConnectPeriod';
import {AbstractRequest, ReqID} from './AbstractRequest';

export interface IRequestDataOnSimObjectPayload extends Record<string, unknown> {
	requestID: number;
	defineID: number;
	objectID: number;
	period: SimConnectPeriod;
	/**
	 * - DATA_REQUEST_FLAG_DEFAULT - default behavior (=0)
	 * - DATA_REQUEST_FLAG_CHANGED
	 * - DATA_REQUEST_FLAG_TAGGED
	 */
	flags: number;
	origin: number;
	interval: number;
	limit: number;
}

/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/Events_And_Data/SimConnect_RequestDataOnSimObject.htm
 */
export class RequestDataOnSimObject extends AbstractRequest<ReqID.ID_REQUEST_DATA_ON_SIM_OBJECT, IRequestDataOnSimObjectPayload> {
	get packetId(): ReqID.ID_REQUEST_DATA_ON_SIM_OBJECT {
		return ReqID.ID_REQUEST_DATA_ON_SIM_OBJECT;
	}
	public static from(buff: ReadBuffer) {
		return new RequestDataOnSimObject({
			requestID: buff.getInt(),
			defineID: buff.getInt(),
			objectID: buff.getInt(),
			period: buff.getInt(),
			flags: buff.getInt(),
			origin: buff.getInt(),
			interval: buff.getInt(),
			limit: buff.getInt(),
		});
	}
	protected handleWrite(send: SendBuffer): void {
		const {requestID, defineID, objectID, period, flags, origin, interval, limit} = this.payload;
		send.putInt(requestID);
		send.putInt(defineID);
		send.putInt(objectID);
		send.putInt(period);
		send.putInt(flags);
		send.putInt(origin);
		send.putInt(interval);
		send.putInt(limit);
	}
}
