process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import 'mocha';
import * as dotenv from 'dotenv';
import {SimConnectClient} from '../src/SimConnectClient';
import { SimConnectPeriod } from '../src/types/SimConnectPeriod';
import { DataType } from '../src/types/DataType';

dotenv.config();

let hostname: string;
let port: number;

describe('test FS2020 client', () => {
	before(function () {
		const thisHostname = process.env.FS2020_ADDRESS;
		if (!thisHostname) {
			this.skip();
		}
		hostname = thisHostname;
		const thisPort = parseInt(process.env.FS2020_PORT || '');
		if (!thisPort || isNaN(thisPort)) {
			this.skip();
		}
		port = thisPort;
	});
	it('should connect to tcp socket and handle Open response', function (done) {
		this.timeout(5000);
		let frames = 0;
		const client = new SimConnectClient({name: 'unit-test', hostname, port, proto: 2});
		client.on('open', (data) => {
			expect(data.name).to.be.eq('KittyHawk');
			expect(data.appVerMajor).to.be.eq(11);
		});
		client.on('error', () => {
			done('error');
		});
		client.on('event', (data) => {
			console.log(data);
			frames++;
			if (frames === 10) {
				client.close();
				done();
			}
		});
		client.connect().then(() => {
			client.subscribeToSystemEvent(8, 'Frame');
		});
	});
	it('should connect to tcp socket and handle Open response', function (done) {
		this.timeout(5000);
		let frames = 0;
		const client = new SimConnectClient({name: 'unit-test', hostname, port, proto: 3});

		client.on('error', () => {
			done('error');
		});
		client.on('event', (data) => {
			console.log(data);
			frames++;
			if (frames === 10) {
				client.close();
				done();
			}
		});
		client.connect().then(async () => {
			await client.addToDataDefinition({defineID: 1, datumName: 'FUEL TOTAL CAPACITY', unitsName: 'gallon', datumType: DataType.SIMCONNECT_DATATYPE_FLOAT64});
			await client.requestDataOnSimObject({requestID: 1, defineID: 1, objectID: 0, period: SimConnectPeriod.ONCE});
		});
	});
});
