import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {AbstractRequest} from './AbstractRequest';

interface IOpenPayload {
	readonly name: string;
	readonly appVerMajor: number;
	readonly appVerMinor: number;
	readonly appBuildMajor: number;
	readonly appBuildMinor: number;
}

export class OpenRequestPacket extends AbstractRequest<IOpenPayload> {
	public packetId = 0x1;
	public static from(buff: ReadBuffer) {
		const name = buff.getString(256);
		buff.getInt();
		buff.getChar();
		buff.getChar();
		buff.getChar();
		const appVerMajor = buff.getInt();
		const appVerMinor = buff.getInt();
		const appBuildMajor = buff.getInt();
		const appBuildMinor = buff.getInt();
		return new OpenRequestPacket({
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
		send.putInt(0);
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
