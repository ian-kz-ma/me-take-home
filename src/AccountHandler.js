class AccountHandler {
    constructor(cooldownHandler) {
        this.accountsMap = new Map();
        this.cooldownHandler = cooldownHandler; // We're passing the cooldownHandler instance to the AccountHandler so that it can reset the cooldown.
    }

    getAccountsMap() {
        return this.accountsMap;
    }

    ingestAccount(accountData) {
        // Reset cooldown timer to prevent shutdown
        this.cooldownHandler.resetCooldown();

        const accountId = accountData.id;
        const version = accountData.version;

        // Check if we already have this account
        if (this.accountsMap.has(accountId)) {
            const existingAccount = this.accountsMap.get(accountId);

            // Ignore accounts with no version
            if (!version) {
                console.log(`IGNORED account ID ${accountId} with no version`);
                return;
            }

            // Ignore older versions of the account
            if (existingAccount.version >= version) {
                return;
            } else {
                // We have a new account version. Cancel old callback
                clearTimeout(existingAccount.callbackTimer);
                console.log(`CANCELED callback for account ID ${accountId}, version ${existingAccount.version}. New version: ${version}`);
            }
        }

        // Set the timer for the callback
        const callbackTimer = setTimeout(() => {
            console.log(`CALLBACK for account ID: ${accountId}, Version: ${version}`);
        }, accountData.callbackTimeMs);

        // We have a new account
        this.accountsMap.set(accountId, {
            ...accountData,
            callbackTimer: callbackTimer
        });
        console.log(`INDEXED account ID: ${accountId}, Version: ${version}`);
    }
}

module.exports = AccountHandler;
