import {ReqPacketTypes} from '.';
import {ReadBuffer} from '../lib/ReadBuffer';
import {ReqID} from './AbstractRequest';
import {AddToDataDefinition} from './AddToDataDefinition';
import {Open} from './Open';
import { RequestDataOnSimObject } from './RequestDataOnSimObject';
import {SubscribeToSystemEvent} from './SubscribeToSystemEvent';
import {Text} from './Text';

type ReqHeadres = {
	size: number;
	protocol: number;
	id: number;
	index: number;
};

export class RequestFactory {
	public static from(buff: ReadBuffer): {headers: ReqHeadres; packet: ReqPacketTypes}[] {
		buff.position(0);
		const packets: {headers: ReqHeadres; packet: ReqPacketTypes}[] = [];
		while (buff.position() < buff.length()) {
			let startPos = buff.position();
			const headers = this.readHeaders(buff);
			switch (headers.id) {
				case ReqID.ID_OPEN: {
					packets.push({headers, packet: Open.from(buff)});
					break;
				}
				case ReqID.ID_SUB_SYSTEM_EVENT: {
					packets.push({headers, packet: SubscribeToSystemEvent.from(buff)});
					break;
				}
				case ReqID.text: {
					packets.push({headers, packet: Text.from(buff)});
					break;
				}
				case ReqID.ID_ADD_TO_DATA_DEFINITION: {
					packets.push({headers, packet: AddToDataDefinition.from(buff)});
					break;
				}
				case ReqID.ID_REQUEST_DATA_ON_SIM_OBJECT: {
					packets.push({headers, packet: RequestDataOnSimObject.from(buff)});
					break;
				}
				default:
					throw new Error('unknown req packet id: ' + headers.id);
			}
			if (startPos + headers.size !== buff.position()) {
				throw new Error(`wrong packet size on {ReqID[headers.id]}`);
			}
		}
		return packets;
	}
	private static readHeaders(buff: ReadBuffer) {
		// buff.position(0);
		return {
			size: buff.getInt(),
			protocol: buff.getInt(),
			id: buff.getInt() & 0x0fffffff,
			index: buff.getInt(),
		};
	}
}
