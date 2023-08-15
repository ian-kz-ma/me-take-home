const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const expect = chai.expect;
const StreamHandler = require('../src/StreamHandler');

describe('StreamHandler', () => {
    describe('class structure tests', () => {
        it('should have a constructor that takes in a filePath and an ingestCallback', () => {
            const streamHandler = new StreamHandler('test.json', () => {});
            expect(streamHandler).to.have.property('filePath');
            expect(streamHandler).to.have.property('ingestCallback');
        });
    
        it('should have a startStream method', () => {
            const streamHandler = new StreamHandler('test.json', () => {});
            expect(streamHandler).to.have.property('startStream');
        });
    });

    describe('Testing the callback with stubs', () => {
        let stubReadFile, stubSetTimeout;
        let mockData;
        before(() => {
            mockData = [
                { id: 1, version: 1 },
                { id: 2, version: 2 },
                { id: 3, version: 3 }
            ];

            stubReadFile = sinon.stub(fs, 'readFile').callsFake((path, encoding, cb) => {
                cb(null, JSON.stringify(mockData));
            });

            //Ingestion delay was causing issues so we need to stub it out
            stubSetTimeout = sinon.stub(global, 'setTimeout').callsFake((cb) => cb());
        });
        after(() => {
            stubReadFile.restore();
            stubSetTimeout.restore();
        });

        it('should call the ingestCallback for each account', () => {
            const ingestCallbackSpy = sinon.spy();

            const streamHandler = new StreamHandler('some_path', ingestCallbackSpy);
            streamHandler.startStream();

            expect(ingestCallbackSpy.callCount).to.equal(3);
        });
    });
});

