import {AddToDataDefinition} from './AddToDataDefinition';
import {Open} from './Open';
import {RequestDataOnSimObject} from './RequestDataOnSimObject';
import {SubscribeToSystemEvent} from './SubscribeToSystemEvent';
import {Text} from './Text';

export type ReqPacketTypes = Open | SubscribeToSystemEvent | Text | AddToDataDefinition | RequestDataOnSimObject;
