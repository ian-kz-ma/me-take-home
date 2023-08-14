class ReportHandler {
    constructor(accountsMap) {
        this.accountsMap = accountsMap;
    }

    generateReport() {
        const highestTokensByType = {};

        this.accountsMap.forEach(account => {
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

        return highestTokensByType;
    }
}

module.exports = ReportHandler;
