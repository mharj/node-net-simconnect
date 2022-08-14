import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {AbstractResponse, RecvID, ResponseAction} from './AbstractResponse';

export interface IOpenResponsePayload {
	readonly name: string;
	readonly appVerMajor: number;
	readonly appVerMinor: number;
	readonly appBuildMajor: number;
	readonly appBuildMinor: number;
	readonly simConVerMajor: number;
	readonly simConVerMinor: number;
	readonly simConBuildMajor: number;
	readonly simConBuildMinor: number;
	readonly reserved1: number;
	readonly reserved2: number;
}

export class OpenResponsePacket extends AbstractResponse<RecvID, IOpenResponsePayload> implements ResponseAction {
	public packetId = RecvID.OPEN;
	public static from(buff: ReadBuffer) {
		return new OpenResponsePacket({
			name: buff.getString(256),
			appVerMajor: buff.getInt(),
			appVerMinor: buff.getInt(),
			appBuildMajor: buff.getInt(),
			appBuildMinor: buff.getInt(),
			simConVerMajor: buff.getInt(),
			simConVerMinor: buff.getInt(),
			simConBuildMajor: buff.getInt(),
			simConBuildMinor: buff.getInt(),
			reserved1: buff.getInt(),
			reserved2: buff.getInt(),
		});
	}
	protected handleWrite(send: SendBuffer): void {
		const {
			name,
			appVerMajor,
			appVerMinor,
			appBuildMajor,
			appBuildMinor,
			simConVerMajor,
			simConVerMinor,
			simConBuildMajor,
			simConBuildMinor,
			reserved1,
			reserved2,
		} = this.payload;
		send.putString(name, 256);
		send.putInt(appVerMajor);
		send.putInt(appVerMinor);
		send.putInt(appBuildMajor);
		send.putInt(appBuildMinor);
		send.putInt(simConVerMajor);
		send.putInt(simConVerMinor);
		send.putInt(simConBuildMajor);
		send.putInt(simConBuildMinor);
		send.putInt(reserved1);
		send.putInt(reserved2);
	}
}
