import {ProtocolVersion} from '..';
import {SendBuffer} from '../lib/SendBuffer';

export enum RecvID {
	ID_NULL = 0,
	ID_EXCEPTION = 1,
	ID_OPEN = 2,
	ID_QUIT = 3,
	ID_EVENT = 4,
	ID_EVENT_OBJECT_ADDREMOVE = 5,
	ID_EVENT_FILENAME = 6,
	ID_EVENT_FRAME = 7,
	ID_SIMOBJECT_DATA = 8,
	ID_SIMOBJECT_DATA_BYTYPE = 9,
	ID_WEATHER_OBSERVATION = 10,
	ID_CLOUD_STATE = 11,
	ID_ASSIGNED_OBJECT_ID = 12,
	ID_RESERVED_KEY = 13,
	ID_CUSTOM_ACTION = 14,
	ID_SYSTEM_STATE = 15,
	ID_CLIENT_DATA = 16,
	/** @since 0.5 */
	ID_EVENT_WEATHER_MODE = 17,
	/** @since 0.5 */
	ID_AIRPORT_LIST = 18,
	/** @since 0.5 */
	ID_VOR_LIST = 19,
	/** @since 0.5 */
	ID_NDB_LIST = 20,
	/** @since 0.5 */
	ID_WAYPOINT_LIST = 21,
	/** @since 0.7 */
	ID_EVENT_MULTIPLAYER_SERVER_STARTED = 22,
	/** @since 0.7 */
	ID_EVENT_MULTIPLAYER_CLIENT_STARTED = 23,
	/** @since 0.7 */
	ID_EVENT_MULTIPLAYER_SESSION_ENDED = 24,
	/** @since 0.7 */
	ID_EVENT_RACE_END = 25,
	/** @since 0.7 */
	ID_EVENT_RACE_LAP = 26,
}
interface IResponseHeader {
	readonly size: number;
	readonly protocol: number;
	readonly id: number;
}
const RESPONSE_HEADER_SIZE = 12;

export abstract class AbstractResponse<D = {}> {
	public abstract packetId: RecvID;
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
	private writeHeader(buff: SendBuffer, protocol: ProtocolVersion) {
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
