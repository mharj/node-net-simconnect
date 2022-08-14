/**
 * https://docs.flightsimulator.com/html/Programming_Tools/SimConnect/API_Reference/Events_And_Data/SimConnect_SubscribeToSystemEvent.htm#parameters
 */
export const systemEventNames = [
	'1sec',
	'4sec',
	'6Hz',
	'AircraftLoaded',
	'Crashed',
	'CrashReset',
	'FlightLoaded',
	'FlightSaved',
	'FlightPlanActivated',
	'FlightPlanDeactivated',
	'Frame',
	'Pause',
	'PauseFrame',
	'PositionChanged',
	'Sim',
	'SimStart',
	'SimStop',
	'Sound',
	'Unpaused',
	'View',
] as const;

const lowercaseSystemEventNames = systemEventNames.map((name) => name.toLowerCase());

export type SystemEventName = typeof systemEventNames[number];

export function isSystemEventName(name: string): name is SystemEventName {
    const lName = name.toLowerCase();
	return lowercaseSystemEventNames.includes(lName);
}
