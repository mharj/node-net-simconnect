import {ReadBuffer} from '../../lib/ReadBuffer';
import {SendBuffer} from '../../lib/SendBuffer';
import {RecvID} from '../AbstractResponse';
import {AbstractEventResponse, EventPayload} from './AbstractEventResponse';

export type FrameEvent = EventPayload<RecvID.EVENT_FRAME, FrameEventProps>;

export type FrameEventProps = {frameRate: number; simSpeed: number};

/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/Structures_And_Enumerations/SIMCONNECT_RECV_EVENT_FRAME.htm
 */
export class FrameEventResponse extends AbstractEventResponse<RecvID.EVENT_FRAME, FrameEventProps> {
	public packetId = RecvID.EVENT_FRAME;

	public static from(buff: ReadBuffer) {
		const header = FrameEventResponse.getEventHeader(buff);
		return new FrameEventResponse(
			{
				frameRate: buff.getFloat(),
				simSpeed: buff.getFloat(),
			},
			header,
		);
	}

	protected handleWrite(send: SendBuffer): void {
		const {frameRate, simSpeed} = this.payload;
		send.putFloat(frameRate);
		send.putFloat(simSpeed);
	}
}
