export class ReadBuffer {
	private buff: Buffer;
	private pos = 0;
	constructor(buffer: Buffer) {
		this.buff = buffer;
	}
	public getByte(): number {
		const data = this.buff.readInt8();
		this.pos++;
		return data;
	}
	public getChar(): string {
		return String.fromCharCode(this.getByte());
	}
	public getShort(value: number) {
		const data = this.buff.readInt16LE(this.pos);
		this.pos += 2;
		return data;
	}
	public getInt(): number {
		const data = this.buff.readInt32LE(this.pos);
		this.pos += 4;
		return data;
	}
	public getLong(): bigint {
		const data = this.buff.readBigInt64LE(this.pos);
		this.pos += 8;
		return data;
	}
	public getFloat(): number {
		const data = this.buff.readFloatLE(this.pos);
		this.pos += 4;
		return data;
	}
	public getDouble(): number {
		const data = this.buff.readDoubleLE(this.pos);
		this.pos += 8;
		return data;
	}
	public getString(size: number) {
		const nameBuffer = this.buff.slice(this.pos, this.pos + size);
		this.pos += size;
		return nameBuffer.slice(0, nameBuffer.indexOf(0x00)).toString();
	}
	public position(pos?: number) {
		if (pos !== undefined) {
			this.pos = pos;
		}
		return this.pos;
	}
}
