import {ProtocolVersion} from '..';
import {SendBuffer} from '../lib/SendBuffer';

export enum ReqID {
	ID_OPEN = 0x1,
	ID_SUB_SYSTEM_EVENT = 0x17,
	ID_UNSUB_SYSTEM_EVENT = 0x18,
}

interface IRequestHeader {
	readonly size: number;
	readonly protocol: number;
	readonly id: number;
	readonly index: number;
}

export const REQUEST_HEADER_SIZE = 16;

export abstract class AbstractRequest<D = {}> {
	public abstract packetId: ReqID;
	protected headers: IRequestHeader | undefined;
	protected payload: D;
	constructor(data: D) {
		this.payload = data;
	}

	protected abstract handleWrite(send: SendBuffer): void;
	public write(send: SendBuffer, protocol: ProtocolVersion, index: number) {
		send.position(REQUEST_HEADER_SIZE);
		this.handleWrite(send);
		this.writeHeader(send, protocol, index);
	}
	private writeHeader(buff: SendBuffer, protocol: ProtocolVersion, index: number) {
		const size = buff.position();
		buff.position(0);
		buff.putInt(size);
		buff.putInt(protocol);
		buff.putInt(0xf0000000 | this.packetId);
		buff.putInt(index);
	}
	public get(key: keyof D): D[keyof D] {
		return this.payload[key];
	}
	public data(): D {
		return this.payload;
	}
}
