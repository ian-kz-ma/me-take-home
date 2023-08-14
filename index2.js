const AccountHandler = require('./src/AccountHandler');
const CooldownHandler = require('./src/CooldownHandler');
const StreamHandler = require('./src/StreamHandler');
const ReportHandler = require('./src/ReportHandler');

const cooldownManager = new CooldownHandler(() => {
    reportManager.generateReport();
    process.exit(0);
});

const accountManager = new AccountHandler(cooldownManager);

const reportManager = new ReportHandler(accountManager.getAccountsMap());

const streamManager = new StreamHandler('coding-challenge-input-ian-ma.json', accountManager.ingestAccount.bind(accountManager));

// Start the streaming process
streamManager.startStream();

