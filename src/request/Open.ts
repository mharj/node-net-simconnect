import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {AbstractRequest, ReqID} from './AbstractRequest';

export interface IOpenRequestPayload extends Record<string, unknown> {
	readonly name: string;
	readonly appVerMajor: number;
	readonly appVerMinor: number;
	readonly appBuildMajor: number;
	readonly appBuildMinor: number;
}

/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/General/SimConnect_Open.htm
 */

export class Open extends AbstractRequest<ReqID.ID_OPEN, IOpenRequestPayload> {
	get packetId(): ReqID.ID_OPEN {
		return ReqID.ID_OPEN;
	}

	public static from(buff: ReadBuffer) {
		const name = buff.getString(256);
		buff.getInt(); // ??
		buff.getChar(); // 0
		buff.getChar(); // X
		buff.getChar(); // S
		buff.getChar(); // F
		const appVerMajor = buff.getInt();
		const appVerMinor = buff.getInt();
		const appBuildMajor = buff.getInt();
		const appBuildMinor = buff.getInt();
		return new Open({
			name,
			appVerMajor,
			appVerMinor,
			appBuildMajor,
			appBuildMinor,
		});
	}
	protected handleWrite(send: SendBuffer): void {
		const {name, appVerMajor, appVerMinor, appBuildMajor, appBuildMinor} = this.payload;
		send.putString(name, 256);
		send.putInt(0); // ??
		send.putByte(0);
		send.putChar('X');
		send.putChar('S');
		send.putChar('F');
		send.putInt(appVerMajor);
		send.putInt(appVerMinor);
		send.putInt(appBuildMajor);
		send.putInt(appBuildMinor);
	}
}
