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

const hexStramQuitResponse = Buffer.from('0c0000000400000003000000', 'hex');

describe('test packet stuff', () => {
	describe('responses', () => {
		it('test open response packet', () => {
			const sendBuffer = new SendBuffer();
			const readBuffer = new ReadBuffer(hexStreamOpenResponse);
			const packet = ResponseFactory.from(readBuffer);
			expect(packet.packetId).to.be.eq(2);
			packet.write(sendBuffer, 4);
			expect(hexStreamOpenResponse.compare(sendBuffer.getBuffer())).to.be.eq(0);
		});
		it('test quit response packet', () => {
			const sendBuffer = new SendBuffer();
			const readBuffer = new ReadBuffer(hexStramQuitResponse);
			const packet = ResponseFactory.from(readBuffer);
			expect(packet.packetId).to.be.eq(3);
			packet.write(sendBuffer, 4);
			expect(hexStramQuitResponse.compare(sendBuffer.getBuffer())).to.be.eq(0);
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
