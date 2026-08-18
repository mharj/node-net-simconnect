import {RecvID} from '../AbstractResponse';
import type {ResPacketTypes} from '../ResponseFactory';
import type {FrameEvent, FrameEventResponse} from './FrameEventResponse';

export type AnyEvent = FrameEvent;

export type EventResponse = FrameEventResponse;

export function isEventResponse(packet: ResPacketTypes): packet is EventResponse {
	return packet.packetId === RecvID.EVENT_FRAME;
}
