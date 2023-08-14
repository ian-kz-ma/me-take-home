const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const CooldownHandler = require('../src/CooldownHandler');

describe('CooldownHandler', () => {
    //Use Sinon fake timers to control time in tests so we dont have to wait for actual cooldowns
    //https://www.npmjs.com/package/sinon
    beforeEach(function() {
        fakeTimer = sinon.useFakeTimers();
    });
    afterEach(function() {
        fakeTimer.restore();
    });

    it('should have a resetCooldown method', () => {
        const cooldownHandler = new CooldownHandler(() => {});
        expect(cooldownHandler).to.have.property('resetCooldown');
    });

    it('should have a constructor that takes in a shutdownCallback and a duration', () => {
        const cooldownHandler = new CooldownHandler(() => {}, 20000);
        expect(cooldownHandler).to.have.property('shutdownCallback');
        expect(cooldownHandler).to.have.property('COOLDOWN_DURATION');
    });

    it('should have a default cooldown duration of 20 seconds', () => {
        const cooldownHandler = new CooldownHandler(() => {});
        expect(cooldownHandler.COOLDOWN_DURATION).to.equal(20000);
    });

    it('should reset the cooldown timer', function() {
        const shutdownSpy = sinon.spy();
        const cooldownManager = new CooldownHandler(shutdownSpy, 5000); 

        cooldownManager.resetCooldown();
        fakeTimer.tick(4000);  
        cooldownManager.resetCooldown();
        fakeTimer.tick(4000); 

        expect(shutdownSpy.called).to.be.false;  
        fakeTimer.tick(2000);  
        expect(shutdownSpy.called).to.be.true;  
    });
});

