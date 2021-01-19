import {OpenPacket} from './send/OpenPacket';
import {SendBuffer} from './SendBuffer';

const simConnectProtocols = [2, 3, 4] as const;
export type SimConnectProtocol = typeof simConnectProtocols[number];

export interface ISimConnectProps {
	proto: SimConnectProtocol;
	name: string;
}

export class SimConnectSender {
	private packetIndex = 1;
	private buffer: SendBuffer;
	private props: ISimConnectProps;
	constructor(props: ISimConnectProps) {
		this.props = props;
		this.buffer = new SendBuffer();
	}
	public openRaw(): Buffer {
		return new OpenPacket(this).toBuffer();
	}
	public usePacketIndex(): number {
		return this.packetIndex++;
	}
	public currentPacketIndex(): number {
		return this.packetIndex;
	}
	public getBuffer() {
		return this.buffer;
	}
	public getProps() {
		return this.props;
	}
}
