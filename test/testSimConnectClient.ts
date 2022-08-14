process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import 'mocha';
import {SimConnectClient} from '../src/SimConnectClient';
import {SimConnectServer} from '../src/SimConnectServer';

let scs: undefined | SimConnectServer;

export const hexFSXOpenRes = Buffer.from(
	'3401000004000000020000004d6963726f736f667420466c696768742053696d756c61746f7220580000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000097f40000000000000a0000000000000097f40000000000004301000000000000',
	'hex',
);

describe('test Sim Connect client', () => {
	before(() => {
		scs = new SimConnectServer({port: 1337, name: 'Microsoft Flight Simulator X'});
		scs.listen();
	});
	it('should connect to tcp socket and handle Open response', (done) => {
		const client = new SimConnectClient({name: 'unit-test', hostname: '127.0.0.1', port: 1337, proto: 2});
		client.on('open', (data) => {
			expect(data.name).to.be.eq('Microsoft Flight Simulator X');
			expect(data.appVerMajor).to.be.eq(10);
			done();
		});
		client.on('close', () => {
			done('error');
		});
		client.connect();
	});
	it('should fail to connect', (done) => {
		const client = new SimConnectClient({name: 'unit-test', hostname: '9871632498761239487', port: 8867, proto: 2});
		client.on('error', () => {
			done();
		});
		client.on('close', () => {
			// ignore
		});
		client.connect();
	});
	after(() => {
		if (scs) {
			scs.close();
		}
	});
});
