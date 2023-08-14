class CooldownHandler {
    constructor(shutdownCallback, duration = 20000) {
        this.cooldownTimer = null;
        this.COOLDOWN_DURATION = duration;
        this.shutdownCallback = shutdownCallback; // This callback function will be invoked when the cooldown expires.
    }

    resetCooldown() {
        if (this.cooldownTimer) clearTimeout(this.cooldownTimer);

        this.cooldownTimer = setTimeout(() => {
            this.shutdownCallback();
        }, this.COOLDOWN_DURATION);
    }
}

module.exports = CooldownHandler;
