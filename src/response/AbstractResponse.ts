import {ProtocolVersion} from '..';
import {SendBuffer} from '../lib/SendBuffer';

/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/Structures_And_Enumerations/SIMCONNECT_RECV_ID.htm
 */
export enum RecvID {
	NULL = 0,
	EXCEPTION = 1,
	OPEN = 2,
	QUIT = 3,
	EVENT = 4,
	EVENT_OBJECT_ADDREMOVE = 5,
	EVENT_FILENAME = 6,
	EVENT_FRAME = 7,
	SIMOBJECT_DATA = 8,
	SIMOBJECT_DATA_BYTYPE = 9,
	WEATHER_OBSERVATION = 10,
	CLOUD_STATE = 11,
	ASSIGNED_OBJECT_ID = 12,
	RESERVED_KEY = 13,
	CUSTOM_ACTION = 14,
	SYSTEM_STATE = 15,
	CLIENT_DATA = 16,
	EVENT_WEATHER_MODE = 17,
	AIRPORT_LIST = 18,
	VOR_LIST = 19,
	NDB_LIST = 20,
	WAYPOINT_LIST = 21,
	EVENT_MULTIPLAYER_SERVER_STARTED = 22,
	EVENT_MULTIPLAYER_CLIENT_STARTED = 23,
	EVENT_MULTIPLAYER_SESSION_ENDED = 24,
	EVENT_RACE_END = 25,
	EVENT_RACE_LAP = 26,
}

export interface ResponseAction {
	packetId: RecvID;
}

interface IResponseHeader {
	readonly size: number;
	readonly protocol: number;
	readonly id: number;
}
export const RESPONSE_HEADER_SIZE = 12;

export abstract class AbstractResponse<R = RecvID, D = {}> {
	public abstract packetId: number;
	protected headers: IResponseHeader | undefined;
	protected payload: D;
	constructor(data: D) {
		this.payload = data;
	}

	protected abstract handleWrite(send: SendBuffer): void;
	public write(send: SendBuffer, protocol: ProtocolVersion) {
		send.reset(); // clear pos and size
		send.position(RESPONSE_HEADER_SIZE);
		this.handleWrite(send);
		this.writeHeader(send, protocol);
	}
	protected writeHeader(buff: SendBuffer, protocol: ProtocolVersion) {
		const size = buff.position();
		buff.position(0);
		buff.putInt(size);
		buff.putInt(protocol);
		buff.putInt(this.packetId);
	}
	public get(key: keyof D): D[keyof D] {
		return this.payload[key];
	}
	public data(): D {
		return this.payload;
	}
}
