export enum SimConnectDataType {
	INVALID = 0, // invalid data type
	/** Integer */
	INT32 = 1, // 32-bit integer number
	/** Integer */
	INT64 = 2, // 64-bit integer number
	/** Floating point */
	FLOAT32 = 3, // 32-bit floating-point number (float)
	/** Floating point */
	FLOAT64 = 4, // 64-bit floating-point number (double)
	/** Fixed-length string */
	STRING8 = 5, // 8-byte string
	/** Fixed-length string */
	STRING32 = 6, // 32-byte string
	/** Fixed-length string */
	STRING64 = 7, // 64-byte string
	/** Fixed-length string */
	STRING128 = 8, // 128-byte string
	/** Fixed-length string */
	STRING256 = 9, // 256-byte string
	/** Fixed-length string */
	STRING260 = 10, // 260-byte string
	/** Variable-length string */
	STRINGV = 11, // variable-length string

	/** {@link InitPosition} data structure */
	INITPOSITION = 12, // see INITPOSITION
	/** {@link MarkerState} data structure */
	MARKERSTATE = 13, // see MARKERSTATE
	/** {@link Waypoint} data structure */
	WAYPOINT = 14, // see WAYPOINT
	/** {@link LatLonAlt} data structure */
	LATLONALT = 15, // see LATLONALT
	/** {@link XYZ} data structure */
	XYZ = 16, // see XYZ

	MAX = 17, // enum limit
}
export namespace SimConnectDataType {
	export function size(type: SimConnectDataType): number | undefined {
		switch (type) {
			case SimConnectDataType.FLOAT32:
			case SimConnectDataType.INT32:
				return 4;
			case SimConnectDataType.FLOAT64:
			case SimConnectDataType.INT64:
			case SimConnectDataType.STRING8:
				return 8;
			case SimConnectDataType.STRING32:
				return 32;
			case SimConnectDataType.STRING64:
				return 64;
			case SimConnectDataType.STRING128:
				return 128;
			case SimConnectDataType.STRING256:
				return 256;
			case SimConnectDataType.STRING260:
				return 260;
			case SimConnectDataType.INITPOSITION:
				return 56;
			case SimConnectDataType.LATLONALT:
				return 24;
			case SimConnectDataType.WAYPOINT:
				return 48;
			case SimConnectDataType.MARKERSTATE:
				return 68;
			case SimConnectDataType.XYZ:
				return 24;
			case SimConnectDataType.STRINGV:
				return undefined; // indicates unknown length
			default:
				return 0;
		}
	}
}
