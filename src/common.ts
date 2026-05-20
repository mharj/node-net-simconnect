type ExtractNumbericValues<T extends object> = {
	[K in keyof T]: T[K] extends number ? T[K] : never;
}[keyof T];

const simConnectDataTypeValues = {
	INVALID: 0, // invalid data type
	/** Integer */
	INT32: 1, // 32-bit integer number
	/** Integer */
	INT64: 2, // 64-bit integer number
	/** Floating point */
	FLOAT32: 3, // 32-bit floating-point number (float)
	/** Floating point */
	FLOAT64: 4, // 64-bit floating-point number (double)
	/** Fixed-length string */
	STRING8: 5, // 8-byte string
	/** Fixed-length string */
	STRING32: 6, // 32-byte string
	/** Fixed-length string */
	STRING64: 7, // 64-byte string
	/** Fixed-length string */
	STRING128: 8, // 128-byte string
	/** Fixed-length string */
	STRING256: 9, // 256-byte string
	/** Fixed-length string */
	STRING260: 10, // 260-byte string
	/** Variable-length string */
	STRINGV: 11, // variable-length string

	/** {@link InitPosition} data structure */
	INITPOSITION: 12, // see INITPOSITION
	/** {@link MarkerState} data structure */
	MARKERSTATE: 13, // see MARKERSTATE
	/** {@link Waypoint} data structure */
	WAYPOINT: 14, // see WAYPOINT
	/** {@link LatLonAlt} data structure */
	LATLONALT: 15, // see LATLONALT
	/** {@link XYZ} data structure */
	XYZ: 16, // see XYZ

	MAX: 17, // enum limit
} as const;


export type SimConnectDataType = ExtractNumbericValues<typeof simConnectDataTypeValues>;



export const SimConnectDataType = {
	...simConnectDataTypeValues,
	/**
	 * Gets the size in bytes of the given SimConnectDataType. For variable-length types, this returns undefined.
	 * @param type The SimConnectDataType to get the size for.
	 * @returns The size in bytes, or undefined for variable-length types.
	 */
	size: (type: ExtractNumbericValues<typeof simConnectDataTypeValues>): number | undefined => {
		switch (type) {
			case simConnectDataTypeValues.FLOAT32:
			case simConnectDataTypeValues.INT32:
				return 4;
			case simConnectDataTypeValues.FLOAT64:
			case simConnectDataTypeValues.INT64:
			case simConnectDataTypeValues.STRING8:
				return 8;
			case simConnectDataTypeValues.STRING32:
				return 32;
			case simConnectDataTypeValues.STRING64:
				return 64;
			case simConnectDataTypeValues.STRING128:
				return 128;
			case simConnectDataTypeValues.STRING256:
				return 256;
			case simConnectDataTypeValues.STRING260:
				return 260;
			case simConnectDataTypeValues.INITPOSITION:
				return 56;
			case simConnectDataTypeValues.LATLONALT:
				return 24;
			case simConnectDataTypeValues.WAYPOINT:
				return 48;
			case simConnectDataTypeValues.MARKERSTATE:
				return 68;
			case simConnectDataTypeValues.XYZ:
				return 24;
			case simConnectDataTypeValues.STRINGV:
				return undefined; // indicates unknown length
			default:
				return 0;
		}
	},
} as const;
