const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const AccountHandler = require('../src/AccountHandler');

describe('AccountHandler', () => {

    describe('class structure tests', () => {
        it('should have a contructor that takes in a cooldownHandler and creates an accountsMap', () => {
            const cooldownHandler = {};
            const accountHandler = new AccountHandler(cooldownHandler);
            expect(accountHandler).to.have.property('accountsMap');
            expect(accountHandler).to.have.property('cooldownHandler');
        });

        it('should have a getAccountsMap method', () => {
            expect(AccountHandler.prototype.getAccountsMap).to.be.a('function');
        });

        it('should have an ingestAccount method', () => {
            expect(AccountHandler.prototype.ingestAccount).to.be.a('function');
        });
    });

    describe('ingestion tests', () => {
        let cooldownHandler;
        let accountHandler;
    
        beforeEach(() => {
            cooldownHandler = {
                resetCooldown: sinon.spy()
            };
            accountHandler = new AccountHandler(cooldownHandler);
    
            originalConsoleLog = console.log;
            console.log = function() {};
        });
    
        afterEach(() => {
            accountHandler.cleanup();  // This ensures all timeouts are cleared.
            console.log = originalConsoleLog;
        });
    
        it('should add an account to the map if it does not exist', () => {
            const account = {
                id: 1,
                version: 1,
                callbackTimeMs: 100
            };
            accountHandler.ingestAccount(account);
            const accountsMap = accountHandler.getAccountsMap();
            expect(accountsMap.get(1).callbackTimeMs).to.equal(100);
        });
    
        it('should not add an account to the map if its version is older or the same', () => {
            const accountOld = {
                id: 1,
                version: 1,
                callbackTimeMs: 100
            };
            const accountSame = {
                id: 1,
                version: 1,
                callbackTimeMs: 200
            };
            accountHandler.ingestAccount(accountOld);
            accountHandler.ingestAccount(accountSame);
            const accountsMap = accountHandler.getAccountsMap();
            expect(accountsMap.get(1).callbackTimeMs).to.equal(100);
        });
    
        it('should update the account in the map if its version is newer', () => {
            const accountOld = {
                id: 1,
                version: 1,
                callbackTimeMs: 100
            };
            const accountNew = {
                id: 1,
                version: 2,
                callbackTimeMs: 200
            };
            accountHandler.ingestAccount(accountOld);
            accountHandler.ingestAccount(accountNew);
            const accountsMap = accountHandler.getAccountsMap();
            expect(accountsMap.get(1).version).to.equal(2);
            expect(accountsMap.get(1).callbackTimeMs).to.equal(200);
        });
    
        it('should call resetCooldown when ingesting an account', () => {
            const account = {
                id: 1,
                version: 1,
                callbackTimeMs: 100
            };
            accountHandler.ingestAccount(account);
            expect(cooldownHandler.resetCooldown.calledOnce).to.be.true;
        });
    
        it('should set a callback after the specified callback time', (done) => {
            const callbackSpy = sinon.spy(console, 'log');
            const account = {
                id: 1,
                version: 1,
                callbackTimeMs: 10
            };
            accountHandler.ingestAccount(account);
    
            setTimeout(() => {
                expect(callbackSpy.calledWith('CALLBACK for account ID: 1, Version: 1')).to.be.true;
                callbackSpy.restore();
                done();
            }, 15);
        });
    });

});
