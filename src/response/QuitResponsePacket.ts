import type {ReadBuffer} from '../lib/ReadBuffer';
import type {SendBuffer} from '../lib/SendBuffer';
import {AbstractResponse, RecvID, type ResponseAction} from './AbstractResponse';

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
	public packetId = RecvID.QUIT;
	public static from(_buff: ReadBuffer) {
		return new QuitResponsePacket(undefined);
	}
	protected handleWrite(_send: SendBuffer): void {
		// nothing
	}
}
