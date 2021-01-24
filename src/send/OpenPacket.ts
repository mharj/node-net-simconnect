import {SimConnectSender} from '../SimConnectSender';
import {SendPacket} from './SendPacket';

const SIMCONNECT_BUILD_SP0 = 60905;
const SIMCONNECT_BUILD_SP1 = 61355;
const SIMCONNECT_BUILD_SP2_XPACK = 61259;

export class OpenPacket extends SendPacket {
	constructor(scs: SimConnectSender) {
		super(scs);
		this.buffer.putString(this.appName, 256);
		this.buffer.putInt(0);
		this.buffer.putByte(0);
		this.buffer.putChar('X');
		this.buffer.putChar('S');
		this.buffer.putChar('F');
		switch (this.protocol) {
			case 2: {
				this.buffer.putInt(0);
				this.buffer.putInt(0);
				this.buffer.putInt(SIMCONNECT_BUILD_SP0);
				this.buffer.putInt(0);
				break;
			}
			case 3: {
				this.buffer.putInt(0);
				this.buffer.putInt(0);
				this.buffer.putInt(SIMCONNECT_BUILD_SP1);
				this.buffer.putInt(0);
				break;
			}
			case 4: {
				this.buffer.putInt(0);
				this.buffer.putInt(0);
				this.buffer.putInt(SIMCONNECT_BUILD_SP2_XPACK);
				this.buffer.putInt(0);
				break;
			}
			default:
				throw new Error('wrong protocol');
		}
		this.buildHeader(0x01);
	}
}
