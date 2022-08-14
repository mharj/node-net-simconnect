import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {AbstractResponse, RecvID, ResponseAction} from './AbstractResponse';

export interface IOpenPayload {
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

export class QuitResponsePacket extends AbstractResponse<RecvID, undefined> implements ResponseAction {
	protected getId(): number {
		throw new Error('Method not implemented.');
	}
	public packetId = RecvID.ID_QUIT;
	public static from(buff: ReadBuffer) {
		return new QuitResponsePacket(undefined);
	}
	protected handleWrite(send: SendBuffer): void {
		// nothing
	}
}
