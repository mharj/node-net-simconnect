import {ReadBuffer} from '../../lib/ReadBuffer';
import {SendBuffer} from '../../lib/SendBuffer';
import {AbstractEventResponse} from './AbstractEventResponse';

export class FrameEventResponse extends AbstractEventResponse<{frameRate: number; simSpeed: number}> {
	protected getId(): number {
		throw new Error('Method not implemented.');
	}
	
	public static from(buff: ReadBuffer) {
		const header = FrameEventResponse.getEventHeader(buff);
		return new FrameEventResponse(
			{
				frameRate: buff.getFloat(),
				simSpeed: buff.getFloat(),
			},
			header,
		);
	}

	protected handleWrite(send: SendBuffer): void {
		const {frameRate, simSpeed} = this.payload;
		send.putFloat(frameRate);
		send.putFloat(simSpeed);
	}
}
