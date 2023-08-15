class CooldownHandler {
    constructor(shutdownCallback, duration = 15000) {
        this.cooldownTimer = null;
        this.COOLDOWN_DURATION = duration;
        this.shutdownCallback = shutdownCallback;
    }

    resetCooldown() {
        if (this.cooldownTimer) clearTimeout(this.cooldownTimer);

        this.cooldownTimer = setTimeout(() => {
            this.shutdownCallback();
        }, this.COOLDOWN_DURATION);
    }
}

module.exports = CooldownHandler;
