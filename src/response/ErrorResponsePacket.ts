import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {AbstractResponse} from './AbstractResponse';

export enum ErrorID {
	NONE = 0,
	ERROR = 1,
	SIZE_MISMATCH = 2,
	UNRECOGNIZED_ID = 3,
	UNOPENED = 4,
	VERSION_MISMATCH = 5,
	TOO_MANY_GROUPS = 6,
	NAME_UNRECOGNIZED = 7,
	TOO_MANY_EVENT_NAMES = 8,
	EVENT_ID_DUPLICATE = 9,
	TOO_MANY_MAPS = 10,
	TOO_MANY_OBJECTS = 11,
	TOO_MANY_REQUESTS = 12,
	WEATHER_INVALID_PORT = 13,
	WEATHER_INVALID_METAR = 14,
	WEATHER_UNABLE_TO_GET_OBSERVATION = 15,
	WEATHER_UNABLE_TO_CREATE_STATION = 16,
	WEATHER_UNABLE_TO_REMOVE_STATION = 17,
	INVALID_DATA_TYPE = 18,
	INVALID_DATA_SIZE = 19,
	DATA_ERROR = 20,
	INVALID_ARRAY = 21,
	CREATE_OBJECT_FAILED = 22,
	LOAD_FLIGHTPLAN_FAILED = 23,
	OPERATION_INVALID_FOR_OJBECT_TYPE = 24,
	ILLEGAL_OPERATION = 25,
	ALREADY_SUBSCRIBED = 26,
	INVALID_ENUM = 27,
	DEFINITION_ERROR = 28,
	DUPLICATE_ID = 29,
	DATUM_ID = 30,
	OUT_OF_BOUNDS = 31,

	ALREADY_CREATED = 32,

	OBJECT_OUTSIDE_REALITY_BUBBLE = 33,

	OBJECT_CONTAINER = 34,

	OBJECT_AI = 35,

	OBJECT_ATC = 36,

	OBJECT_SCHEDULE = 37,
}
export function isErrorId(value: number): value is ErrorID {
	return Object.values(ErrorID).includes('value');
}

export interface IPayload {
	readonly errorId: ErrorID;
	readonly sendID: number;
	readonly index: number;
}

export class ErrorResponsePacket extends AbstractResponse<IPayload> {
	public packetId = 0x1;
	public static from(buff: ReadBuffer) {
		return new ErrorResponsePacket({
			errorId: buff.getInt(),
			sendID: buff.getInt(),
			index: buff.getInt(),
		});
	}
	protected handleWrite(send: SendBuffer): void {
		const {errorId, sendID, index} = this.payload;
		send.putInt(errorId);
		send.putInt(sendID);
		send.putInt(index);
	}
}
