process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import 'mocha';

import {SendBuffer} from '../src/SendBuffer';

describe('test send buffer', () => {
	it('should build valid buffer', () => {
		const buffer = new SendBuffer();
		expect(buffer.position()).to.be.eq(0);
		buffer.putString('hello', 8);
		expect(buffer.position()).to.be.eq(8);
		buffer.putInt(32767);
		// expect(buffer.position()).to.be.eq(12);
		// console.log(buffer.getBuffer());
	});
});
