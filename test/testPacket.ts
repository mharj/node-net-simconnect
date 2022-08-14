process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import 'mocha';
import {ReadBuffer} from '../src/lib/ReadBuffer';
import {SendBuffer} from '../src/lib/SendBuffer';
import {ResponseFactory} from '../src/response/ResponseFactory';

const hexStreamOpenResponse = Buffer.from(
	'3401000004000000020000004d6963726f736f667420466c696768742053696d756c61746f7220580000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000097f40000000000000a0000000000000097f40000000000004301000000000000',
	'hex',
);
export const test = Buffer.from(
	'1401000004000000170000f002000000010000006672616d650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'hex',
);

const hexStreamQuitResponse = Buffer.from('0c0000000400000003000000', 'hex');
const hexStreamFrameResponse = Buffer.from('200000000400000007000000ffffffff010000000000000092d8b9420000803f', 'hex');



describe('test packet stuff', () => {
	describe('responses', () => {
		it('test open response packet', () => {
			const sendBuffer = new SendBuffer();
			const readBuffer = new ReadBuffer(hexStreamOpenResponse);
			const packet = ResponseFactory.from(readBuffer)[0];
			expect(packet.packetId).to.be.eq(2);
			packet.write(sendBuffer, 4);
			expect(hexStreamOpenResponse.compare(sendBuffer.getBuffer())).to.be.eq(0);
		});
		it('test quit response packet', () => {
			const sendBuffer = new SendBuffer();
			const readBuffer = new ReadBuffer(hexStreamQuitResponse);
			const packet = ResponseFactory.from(readBuffer)[0];
			expect(packet.packetId).to.be.eq(3);
			packet.write(sendBuffer, 4);
			expect(hexStreamQuitResponse.compare(sendBuffer.getBuffer())).to.be.eq(0);
		});
		it('test frame response packet', () => {
			const sendBuffer = new SendBuffer();
			const readBuffer = new ReadBuffer(hexStreamFrameResponse);
			const packet = ResponseFactory.from(readBuffer)[0];
			expect(packet.packetId).to.be.eq(0x07);
			packet.write(sendBuffer, 4);
			expect(hexStreamFrameResponse.compare(sendBuffer.getBuffer())).to.be.eq(0);
		});
	});
	describe('requests', () => {
		/* 		it('test quit response packet', () => {
			const sendBuffer = new SendBuffer();
			const readBuffer = new ReadBuffer(hexStreamOpenResponse);
			const packet = ResponseFactory.from(readBuffer);
			expect(packet.packetId).to.be.eq(2);
			packet.write(sendBuffer, 4);
			expect(hexStreamOpenResponse.compare(sendBuffer.getBuffer())).to.be.eq(0);
		}); */
	});
});
