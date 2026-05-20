import {DeferredPromise} from '@open-draft/deferred-promise';
import * as dotenv from 'dotenv';
import {describe, expect, it} from 'vitest';
import {SimConnectClient} from '../src/SimConnectClient';
import {DataType} from '../src/types/DataType';
import {SimConnectPeriod} from '../src/types/SimConnectPeriod';

dotenv.config();

const hostname = process.env.FS2020_ADDRESS as string;
const port = (process.env.FS2020_PORT && parseInt(process.env.FS2020_PORT, 10)) as number;

describe('test FS2020 client', {skip: !hostname || !port}, () => {
	it('should connect to tcp socket and handle Open response', async function () {
		const done = new DeferredPromise<void>();
		let frames = 0;
		const client = new SimConnectClient({name: 'unit-test', hostname, port, proto: 2});
		client.on('open', (data) => {
			expect(data.name).to.be.eq('KittyHawk');
			expect(data.appVerMajor).to.be.eq(11);
		});
		client.on('error', () => {
			done.reject(new Error('error'));
		});
		client.on('event', (data) => {
			console.log(data);
			frames++;
			if (frames === 10) {
				client.close();
				done.resolve();
			}
		});
		client.connect().then(() => {
			client.subscribeToSystemEvent(8, 'Frame');
		});
		await done;
	});
	it('should connect to tcp socket and handle Open response', async function () {
		const done = new DeferredPromise<void>();
		let frames = 0;
		const client = new SimConnectClient({name: 'unit-test', hostname, port, proto: 3});

		client.on('error', () => {
			done.reject(new Error('error'));
		});
		client.on('event', (data) => {
			console.log(data);
			frames++;
			if (frames === 10) {
				client.close();
				done.resolve();
			}
		});
		client.connect().then(async () => {
			await client.addToDataDefinition({defineID: 1, datumName: 'FUEL TOTAL CAPACITY', unitsName: 'gallon', datumType: DataType.SIMCONNECT_DATATYPE_FLOAT64});
			await client.requestDataOnSimObject({requestID: 1, defineID: 1, objectID: 0, period: SimConnectPeriod.ONCE});
		});
		await done;
	});
});
