import { RecvID } from "../AbstractResponse";
import { ResponseFactory } from "../ResponseFactory";
import { FrameEventResponse } from "./FrameEventResponse";

export type EventResponse = FrameEventResponse;

export function isEventResponse(packet: ReturnType<typeof ResponseFactory.from>): packet is EventResponse {
	return packet.packetId === RecvID.ID_EVENT_FRAME;
}