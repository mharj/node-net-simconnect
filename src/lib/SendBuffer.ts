const RECEIVE_SIZE = 65536;
// LITTLE_ENDIAN
export class SendBuffer {
	private pos = 0;
	private size = 0;
	private buffer = Buffer.alloc(RECEIVE_SIZE);
	public constructor() {
		// nothing yet
	}
	public putShort(value: number) {
		this.pos = this.buffer.writeInt16LE(value, this.pos);
		this.checkSize();
	}
	public putInt(value: number) {
		this.pos = this.buffer.writeInt32LE(value, this.pos);
		this.checkSize();
	}
	public putUInt(value: number) {
		this.pos = this.buffer.writeUInt32LE(value, this.pos);
		this.checkSize();
	}
	public putLong(value: bigint) {
		this.pos = this.buffer.writeBigInt64LE(value, this.pos);
		this.checkSize();
	}
	public putFloat(value: number) {
		this.pos = this.buffer.writeFloatLE(value, this.pos);
		this.checkSize();
	}

	public putDouble(value: number) {
		this.pos = this.buffer.writeDoubleLE(value, this.pos);
		this.checkSize();
	}
	public putChar(value: string) {
		if (value.length === 0) {
			throw new TypeError('string too short');
		}
		this.pos = this.buffer.writeInt8(value.charCodeAt(0), this.pos);
		this.checkSize();
	}
	public putByte(value: number) {
		this.pos = this.buffer.writeInt8(value, this.pos);
		this.checkSize();
	}
	public put(value: number | string) {
		if (typeof value === 'number' && Number.isInteger(value)) {
			if (value < 0 || value > 256) {
				throw new TypeError('value is too big');
			}
		} else if (typeof value === 'string') {
			if (value.length !== 1) {
				throw new TypeError('string too long');
			}
			value = value.charCodeAt(0);
		} else {
			throw new TypeError('value is not valid type');
		}
		this.pos = this.buffer.writeInt8(value, this.pos);
		this.checkSize();
	}
	public putString(value: string, alloc: number) {
		this.buffer.fill(0, this.pos, this.pos + alloc);
		this.buffer.write(value, this.pos, this.pos + alloc - 1);
		this.pos += alloc;
		this.checkSize();
	}
	public reset() {
		this.pos = 0;
		this.size = 0;
	}
	public position(pos?: number): number {
		if (pos !== undefined) {
			this.pos = pos;
		}
		return this.pos;
	}
	public getBuffer(): Buffer {
		return this.buffer.slice(0, this.size);
	}
	private checkSize() {
		this.size = Math.max(this.pos, this.size);
	}
}
