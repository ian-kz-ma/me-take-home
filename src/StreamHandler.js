const fs = require('fs');

class StreamHandler {
    constructor(filePath, ingestCallback) {
        this.filePath = filePath;
        this.ingestCallback = ingestCallback; // This will be the ingestAccount function
    }

    startStream() {
        fs.readFile(this.filePath, 'utf-8', (err, data) => {
            if (err) throw err;
            const accounts = JSON.parse(data);

            // Simulate account updates by reading from the file and ingesting each account with a random delay
            accounts.forEach(account => {
                const ingestionTime = Math.floor(Math.random() * 1001);
                setTimeout(() => {
                    this.ingestCallback(account); // This calls the ingestAccount function for each account
                }, ingestionTime);
            });
        });
    }
}

module.exports = StreamHandler;
