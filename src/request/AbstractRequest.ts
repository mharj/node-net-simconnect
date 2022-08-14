import {ProtocolVersion} from '..';
import {SendBuffer} from '../lib/SendBuffer';

export enum ReqID {
	ID_OPEN = 0x01,
	ID_REQ_RES_TIMES = 0x03,
	ID_MAP_CLIENT_EVENT_TO_SIM_EVENT = 0x04,
	ID_TRANSMIT_CLIENT_EVENT = 0x05,
	ID_SET_SYSTEM_EVENT_STATE = 0x06,
	addClientEventToNotificationGroup = 0x07,
	removeClientEvent = 0x08,
	setNotificationGroupPriority = 0x09,
	clearNotificationGroup = 0x0a,
	requestNotificationGroup = 0x0b,
	ID_ADD_TO_DATA_DEFINITION = 0x0c,
	ID_CLEAR_DATA_DEFINITION = 0x0d,
	ID_REQUEST_DATA_ON_SIM_OBJECT = 0x0e,
	ID_REQUEST_DATA_ON_SIM_OBJECT_TYPE = 0x0f,
	setDataOnSimObject = 0x10,
	mapInputEventToClientEvent = 0x11,
	setInputGroupPriority = 0x12,
	removeInputEvent = 0x13,
	clearInputGroup = 0x14,
	setInputGroupState = 0x15,
	requestReservedKey = 0x16,
	ID_SUB_SYSTEM_EVENT = 0x17,
	ID_UNSUB_SYSTEM_EVENT = 0x18,
	weatherRequestInterpolatedObservation = 0x19,
	weatherRequestObservationAtStation = 0x1a,
	weatherRequestObservationAtNearestStation = 0x1b,
	weatherCreateStation = 0x1c,
	weatherRemoveStation = 0x1d,
	weatherSetObservation = 0x1e,
	weatherSetModeServer = 0x1f,
	weatherSetModeTheme = 0x20,
	weatherSetModeGlobal = 0x21,
	weatherSetModeCustom = 0x22,
	weatherSetDynamicUpdateRate = 0x23,
	weatherRequestCloudState = 0x24,
	weatherCreateThermal = 0x25,
	weatherRemoveThermal = 0x26,
	aICreateParkedATCAircraft = 0x27,
	aICreateEnrouteATCAircraft = 0x28,
	aICreateNonATCAircraft = 0x29,
	aICreateSimulatedObject = 0x2a,
	aIReleaseControl = 0x2b,
	aIRemoveObject = 0x2c,
	aISetAircraftFlightPlan = 0x2d,
	executeMissionAction = 0x2e,
	completeCustomMissionAction = 0x2f,
	cameraSetRelative6DOF = 0x30,
	menuAddItem = 0x31,
	menuDeleteItem = 0x32,
	menuAddSubItem = 0x33,
	menuDeleteSubItem = 0x34,
	requestSystemState = 0x35,
	setSystemState = 0x36,
	mapClientDataNameToID = 0x37,
	createClientData = 0x38,
	addToClientDataDefinition = 0x39,
	clearClientDataDefinition = 0x3a,
	requestClientData = 0x3b,
	setClientData = 0x3c,
	flightLoad = 0x3d,
	flightSave = 0x3e,
	flightPlanLoad = 0x3f,
	text = 0x40,
	subscribeToFacilities = 0x41,
	unSubscribeToFacilities = 0x42,
	requestFacilitiesList = 0x43,
}

interface IRequestHeader {
	readonly size: number;
	readonly protocol: number;
	readonly id: number;
	readonly index: number;
}

export const REQUEST_HEADER_SIZE = 16;

export abstract class AbstractRequest<R extends number, Cons extends Record<string, unknown>> {
	protected headers: IRequestHeader | undefined;
	protected payload: Cons;

	constructor(data: Cons) {
		this.payload = data;
	}
	abstract get packetId(): R;

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
	public data(): Cons {
		return this.payload;
	}
}
