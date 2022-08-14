import {RecvID} from '../AbstractResponse';
import {ResPacketTypes} from '../ResponseFactory';
import {FrameEvent, FrameEventResponse} from './FrameEventResponse';

export type AnyEvent = FrameEvent;

export type EventResponse = FrameEventResponse;

export function isEventResponse(packet: ResPacketTypes): packet is EventResponse {
	return packet.packetId === RecvID.EVENT_FRAME;
}
