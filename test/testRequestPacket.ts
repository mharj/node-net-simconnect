process.env.NODE_ENV = 'test';
import {expect} from 'chai';
import 'mocha';
import {ReadBuffer} from '../src/lib/ReadBuffer';
import {SendBuffer} from '../src/lib/SendBuffer';
import { ReqID } from '../src/request/AbstractRequest';
import {RequestFactory} from '../src/request/RequestFactory';
import {SubscribeToSystemEvent} from '../src/request/SubscribeToSystemEvent';
// import {ResponseFactory} from '../src/response/ResponseFactory';

const reqSubSystemEvent = Buffer.from(
	'1401000004000000170000f002000000010000006672616d650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	'hex',
);

const addToDataDefinition = Buffer.from(
	'20020000040000000c0000f002000000010000004655454c20544f54414c20434150414349545900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000067616c6c6f6e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000ffffffff',
	'hex',
);

const reqDataOnSimObject2 = Buffer.from('30000000040000000e0000f0030000000100000001000000000000000100000000000000000000000000000000000000', 'hex');

describe('test request packet', () => {
	it('test open response packet', () => {
		const sendBuffer = new SendBuffer();
		const readBuffer = new ReadBuffer(reqSubSystemEvent);
		const packets = RequestFactory.from(readBuffer);
		const {packet, headers} = packets[0];
		expect(packet.packetId).to.be.eq(ReqID.ID_SUB_SYSTEM_EVENT);
		expect(packet.data()).to.be.eql({clientEventID: 1, name: 'frame'});
		new SubscribeToSystemEvent({clientEventID: 1, name: 'frame' as any}).write(sendBuffer, headers.protocol as any, headers.index);
		expect(reqSubSystemEvent.compare(sendBuffer.getBuffer())).to.be.eq(0);
	});
	it('test open response packet', () => {
		// const sendBuffer = new SendBuffer();
		const readBuffer = new ReadBuffer(addToDataDefinition);
		const packets = RequestFactory.from(readBuffer);
		expect(packets.length).to.be.eq(1);
		const {packet, headers} = packets[0];
		expect(packet.packetId).to.be.eq(ReqID.addToClientDataDefinition);
		console.log(headers, packet.data());
		/* 		expect(packet.data()).to.be.eql({clientEventID: 1, name: 'frame'});
		new SubscribeToSystemEvent({clientEventID: 1, name: 'frame'}).write(sendBuffer, headers.protocol as any, headers.index);
		expect(reqSubSystemEvent.compare(sendBuffer.getBuffer())).to.be.eq(0); */
	});
	it('test open response packet', () => {
		// const sendBuffer = new SendBuffer();
		const readBuffer = new ReadBuffer(reqDataOnSimObject2);
		const packets = RequestFactory.from(readBuffer);
		expect(packets.length).to.be.eq(1);
		const {packet, headers} = packets[0];
		expect(packet.packetId).to.be.eq(ReqID.ID_REQUEST_DATA_ON_SIM_OBJECT);
		console.log(headers, packet.data());
		/* 		expect(packet.data()).to.be.eql({clientEventID: 1, name: 'frame'});
		new SubscribeToSystemEvent({clientEventID: 1, name: 'frame'}).write(sendBuffer, headers.protocol as any, headers.index);
		expect(reqSubSystemEvent.compare(sendBuffer.getBuffer())).to.be.eq(0); */
	});
});
