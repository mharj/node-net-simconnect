import {ReadBuffer} from '../lib/ReadBuffer';
import {SendBuffer} from '../lib/SendBuffer';
import {DataType} from '../types/DataType';
import {AbstractRequest, ReqID} from './AbstractRequest';

export interface IAddToDataDefinitionPayload extends Record<string, unknown> {
	/**
	 * Specifies the ID of the client defined data definition.
	 */
	defineID: number;
	/**
	 * Specifies the name of the Microsoft Flight Simulator simulation variable.
	 * See the [Simulation Variables documents](https://docs.flightsimulator.com/html/Programming_Tools/SimVars/Simulation_Variables.htm) for tables of variable names.
	 * If an index is required then it should be appended to the variable name following a colon,
	 * see the example for DEFINITION_2 below. Indexes are numbered from 1 (not zero).
	 * Simulation variable names are not case-sensitive (so can be entered in upper or lower case).
	 */
	datumName: string;
	unitsName: string;
	datumType: DataType;
	fEpsilon: number;
	datumID: number;
}

/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/Events_And_Data/SimConnect_AddToDataDefinition.htm
 */
export class AddToDataDefinition extends AbstractRequest<ReqID.addToClientDataDefinition, IAddToDataDefinitionPayload> {
	get packetId(): ReqID.addToClientDataDefinition {
		return ReqID.addToClientDataDefinition;
	}
	public static from(buff: ReadBuffer) {
		return new AddToDataDefinition({
			defineID: buff.getInt(),
			datumName: buff.getString(256),
			unitsName: buff.getString(256),
			datumType: buff.getInt(),
			fEpsilon: buff.getFloat(),
			datumID: buff.getInt(),
		});
	}
	protected handleWrite(send: SendBuffer): void {
		const {defineID, datumName, unitsName, datumType, fEpsilon, datumID} = this.payload;
		send.putInt(defineID);
		send.putString(datumName, 256);
		send.putString(unitsName, 256);
		send.putInt(datumType);
		send.putFloat(fEpsilon);
		send.putInt(datumID);
	}
}
