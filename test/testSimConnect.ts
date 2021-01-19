process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import 'mocha';
import {SimConnectSender} from '../src/SimConnectSender';

describe('test sim connect', () => {
	it('should validate open buffer', () => {
		const sc = new SimConnectSender({proto: 4, name: 'unit-test'});
		const idx = sc.currentPacketIndex();
		const buffer = sc.openRaw();
		expect(buffer.length).to.be.eq(16 + 256 + 4 + 1 + 1 + 1 + 4 + 4 + 4 + 4);
		expect(buffer.readInt16LE(12)).to.be.eq(idx); // packet index
		expect(sc.currentPacketIndex()).to.be.eq(idx + 1);
	});
});
