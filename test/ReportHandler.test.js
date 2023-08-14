const chai = require('chai');
const expect = chai.expect;
const ReportHandler = require('../src/ReportHandler');

describe('ReportHandler', () => {
    //Suppress console.log output to make the test output more readable
    let originalConsoleLog;
    before(function() {
        originalConsoleLog = console.log;
        console.log = function() {};
    });
    after(function() {
        console.log = originalConsoleLog;
    });

    it('should have a generateReport method', () => {
        const reportHandler = new ReportHandler();
        expect(reportHandler).to.have.property('generateReport');
    });

    it('should have a constructor that takes in an accountsMap', () => {
        const reportHandler = new ReportHandler();
        expect(reportHandler).to.have.property('accountsMap');
    });

    it('should correctly identify the accounts with the highest tokens by type', function() {
        const mockAccountsMap = new Map();

        //Assumes that the AccountHandler ingested and updated the accounts correctly -
        //There shouldn't be all versions of an account in the map, only the latest version
        mockAccountsMap.set(1, { id: 1, tokens: 50, accountType: 'A', version: 11 });
        mockAccountsMap.set(2, { id: 2, tokens: 100, accountType: 'B', version: 14 });
        mockAccountsMap.set(3, { id: 3, tokens: 30, accountType: 'A', version: 24 });
        mockAccountsMap.set(4, { id: 4, tokens: 200, accountType: 'B', version: 4 });
        mockAccountsMap.set(5, { id: 5, tokens: 100, accountType: 'C', version: 8 });
        mockAccountsMap.set(6, { id: 6, tokens: 700, accountType: 'C', version: 9 });
        mockAccountsMap.set(7, { id: 7, tokens: 100, accountType: 'C', version: 6 });

        const reportHandler = new ReportHandler(mockAccountsMap);
        const report = reportHandler.generateReport();

        expect(report['A'].tokens).to.equal(50);
        expect(report['B'].tokens).to.equal(200);
        expect(report['C'].tokens).to.equal(700);
    });
});

