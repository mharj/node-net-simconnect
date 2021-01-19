import {SendBuffer} from '../SendBuffer';
import {SimConnectProtocol, SimConnectSender} from '../SimConnectSender';

export class SendPacket {
	protected appName: string;
	protected protocol: SimConnectProtocol;
	protected buffer: SendBuffer;
	private scs: SimConnectSender;
	constructor(scs: SimConnectSender) {
		this.scs = scs;
		this.buffer = scs.getBuffer();
		const {name, proto} = scs.getProps();
		this.appName = name;
		this.protocol = proto;
		this.clean();
	}
	protected buildHeader(type: number) {
		const packetSize = this.buffer.position();
		this.buffer.position(0);
		this.buffer.putInt(packetSize);
		this.buffer.putInt(this.protocol);
		this.buffer.putInt(0xf0000000 | type);
		this.buffer.putInt(this.scs.usePacketIndex());
	}
	public toBuffer() {
		return this.buffer.getBuffer();
	}
	private clean() {
		this.buffer.position(16);
	}
}
