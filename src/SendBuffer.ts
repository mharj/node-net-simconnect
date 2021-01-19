const RECEIVE_SIZE = 65536;
// LITTLE_ENDIAN
export class SendBuffer {
	private static instance: SendBuffer | undefined;
	public static getInstance(): SendBuffer {
		if (!SendBuffer.instance) {
			SendBuffer.instance = new SendBuffer();
		}
		return SendBuffer.instance;
	}
	private pos = 0;
	private buffer = Buffer.alloc(RECEIVE_SIZE);
	private constructor() {
		// nothing yet
	}
	public putInt(value: number) {
		this.pos += this.buffer.writeInt16LE(value, this.pos);
	}
	public putLong(value: number) {
		this.pos += this.buffer.writeInt32LE(value, this.pos);
	}
    public putString(value: string | Buffer, alloc: number) {
        const strBuff = Buffer.alloc(Math.min(alloc, value.length));
        let builder = value;
        for (let i = 0; i < alloc; i++) {
            this.buffer.write
        }
        // TODO build alloc size buffer and 
    }
    public position(): number {
        return this.pos;
    }
}
