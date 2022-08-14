import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {isSystemEventName, SystemEventName} from '../types/SystemEventName';
import {AbstractRequest, ReqID} from './AbstractRequest';

export interface ISubSystemEventRequestPayload extends Record<string, unknown> {
	readonly clientEventID: number;
	readonly name: SystemEventName;
}

/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/Events_And_Data/SimConnect_SubscribeToSystemEvent.htm
 */

export class SubscribeToSystemEvent extends AbstractRequest<ReqID.ID_SUB_SYSTEM_EVENT, ISubSystemEventRequestPayload> {
	get packetId(): ReqID.ID_SUB_SYSTEM_EVENT {
		return ReqID.ID_SUB_SYSTEM_EVENT;
	}

	public static from(buff: ReadBuffer) {
		const clientEventID = buff.getInt();
		const name = buff.getString(256);
		if (!isSystemEventName(name)) {
			throw new Error(`Invalid system event name: ${name}`);
		}
		return new SubscribeToSystemEvent({
			name,
			clientEventID,
		});
	}
	protected handleWrite(send: SendBuffer): void {
		const {clientEventID, name} = this.payload;
		send.putInt(clientEventID);
		send.putString(name, 256);
	}
}
