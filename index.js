const AccountHandler = require('./src/AccountHandler');
const CooldownHandler = require('./src/CooldownHandler');
const StreamHandler = require('./src/StreamHandler');
const ReportHandler = require('./src/ReportHandler');

const cooldownHandler = new CooldownHandler(() => {
    reportHandler.generateReport();
    process.exit(0);
});

const accountHandler = new AccountHandler(cooldownHandler);

const reportHandler = new ReportHandler(accountHandler.getAccountsMap());

const streamHandler = new StreamHandler('coding-challenge-input-ian-ma.json', accountHandler.ingestAccount.bind(accountHandler));

// Start the streaming process
streamHandler.startStream();

