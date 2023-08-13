const fs = require('fs');

let accountsMap = new Map();
let ingestedCounter = 0;
let callbackCounter = 0;
let cooldownTimer = null;
const COOLDOWN_DURATION = 10000; // 5 seconds; adjust based on expected frequency of data

const ingestAccount = (accountData) => {
    resetCooldown();

    const accountId = accountData.id;
    const version = accountData.version;

    if (accountsMap.has(accountId)) {
        const existingAccount = accountsMap.get(accountId);
        if (existingAccount.version >= version) {
            // Ignore older versions
            return;
        } else {
            // Cancel older callback
            clearTimeout(existingAccount.callbackTimer);
            console.log(`Callback for ${accountId} version ${existingAccount.version} is canceled in favor of version ${version}`);
        }
    }

    const callbackTimer = setTimeout(() => {
        console.log(`Callback for account ID: ${accountId}, Version: ${version}`);
        callbackCounter++;
        checkShutdown();
    }, accountData.callbackTimeMs);

    accountsMap.set(accountId, {
        ...accountData,
        callbackTimer: callbackTimer
    });

    console.log(`Indexed account ID: ${accountId}, Version: ${version}`);
    ingestedCounter++;
    checkShutdown();
};

const resetCooldown = () => {
    if (cooldownTimer) clearTimeout(cooldownTimer);

    cooldownTimer = setTimeout(() => {
        shutdownSystem();
    }, COOLDOWN_DURATION);
};

const checkShutdown = () => {
    if (ingestedCounter === callbackCounter) {
        shutdownSystem();
    }
};

const shutdownSystem = () => {
    const highestTokensByType = {};
    accountsMap.forEach(account => {
        if (!highestTokensByType[account.accountType] || highestTokensByType[account.accountType].tokens < account.tokens) {
            highestTokensByType[account.accountType] = account;
        }
    });

    console.log('\nHighest token-value accounts by AccountType:');
    for (const [type, account] of Object.entries(highestTokensByType)) {
        console.log(`AccountType: ${type}, AccountID: ${account.id}, Tokens: ${account.tokens}, Version: ${account.version}, Data: ${JSON.stringify(account.data)}`);
    }
    process.exit(0);
};


const readAccountUpdates = () => {
    fs.readFile('coding-challenge-input-ian-ma.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const accounts = JSON.parse(data);
        accounts.forEach(account => {
            const ingestionTime = Math.floor(Math.random() * 1001); // Random time between 0 to 1000ms
            setTimeout(() => {
                ingestAccount(account);
            }, ingestionTime);
        });
    });
};

readAccountUpdates();
