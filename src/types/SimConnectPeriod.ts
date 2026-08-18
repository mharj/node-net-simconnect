export const SimConnectPeriod = {
	/** Specifies that the data is not to be sent. */
	NEVER: 0,
	/** Specifies that the data should be sent once only. Note that this is not an efficient way of receiving
	 * data frequently, use one of the other periods if there is a regular frequency to the data request. */
	ONCE: 1,
	/** Specifies that the data should be sent every visual (rendered) frame. */
	VISUAL_FRAME: 2,
	/** Specifies that the data should be sent every simulated frame, whether that frame is rendered or not. */
	SIM_FRAME: 3,
	/** Specifies that the data should be sent once every second. */
	SECOND: 4,
} as const;

export type SimConnectPeriod = (typeof SimConnectPeriod)[keyof typeof SimConnectPeriod];
