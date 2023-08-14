const fs = require('fs');

let accountsMap = new Map();
let cooldownTimer = null;
const COOLDOWN_DURATION = 20000; // After 20 seconds of no account updates, the system will shutdown

const ingestAccount = (accountData) => {
    //Reset cooldown timer to prevent shutdown
    resetCooldown();

    const accountId = accountData.id;
    const version = accountData.version;

    //Check if we already have this account
    if (accountsMap.has(accountId)) {
        const existingAccount = accountsMap.get(accountId);

        //Ignore accounts with no version
        if (!version) { 
            console.log(`IGNORED account ID ${accountId} with no version`);
            return; 
        }

        //Ignore older versions of the account
        if (existingAccount.version >= version) {
            return;
        } else {
            //We have a new account version. Cancel old callback
            clearTimeout(existingAccount.callbackTimer);
            console.log(`CANCELED callback for account ID ${accountId}, version ${existingAccount.version}. New version: ${version}`);
        }
    }

    //Set the timer for the callback
    const callbackTimer = setTimeout(() => {
        console.log(`CALLBACK for account ID: ${accountId}, Version: ${version}`);
    }, accountData.callbackTimeMs);

    //We have a new account
    accountsMap.set(accountId, {
        ...accountData,
        callbackTimer: callbackTimer
    });
    console.log(`INDEXED account ID: ${accountId}, Version: ${version}`);
};

const resetCooldown = () => {
    if (cooldownTimer) clearTimeout(cooldownTimer);

    cooldownTimer = setTimeout(() => {
        shutdownSystem();
    }, COOLDOWN_DURATION);
};

const shutdownSystem = () => {
    const highestTokensByType = {};

    accountsMap.forEach(account => {
        if (!highestTokensByType[account.accountType] || highestTokensByType[account.accountType].tokens < account.tokens) {
            highestTokensByType[account.accountType] = account;
        }
    });

    console.log('\n\nShutting down.....\n\n');
    console.log('===================================================================');
    console.log('========== Highest token-value accounts by AccountType ============');
    console.log('===================================================================\n');

    for (const [type, account] of Object.entries(highestTokensByType)) {
        console.log(`AccountType: ${type}, Tokens: ${account.tokens}, AccountID: ${account.id}, Version: ${account.version}`);
    }
    process.exit(0);
};

const startAccountStream = () => {
    fs.readFile('coding-challenge-input-ian-ma.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const accounts = JSON.parse(data);

        // Simulate account updates by reading from the file and ingesting each account with a random delay
        accounts.forEach(account => {
            const ingestionTime = Math.floor(Math.random() * 1001);
            setTimeout(() => {
                ingestAccount(account);
            }, ingestionTime);
        });
    });
};

//Initialize the account stream simulation
startAccountStream();
