import type {AddToDataDefinition} from './AddToDataDefinition';
import type {Open} from './Open';
import type {RequestDataOnSimObject} from './RequestDataOnSimObject';
import type {SubscribeToSystemEvent} from './SubscribeToSystemEvent';
import type {Text} from './Text';

export type ReqPacketTypes = Open | SubscribeToSystemEvent | Text | AddToDataDefinition | RequestDataOnSimObject;
