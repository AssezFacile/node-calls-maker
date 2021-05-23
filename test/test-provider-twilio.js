const { expect, assert } = require('chai');
const twilio = require('proxyquire')('../library/modules/provider/twilio', {
    'twilio': (accountSid) => {
        if (accountSid) {
            return {
                calls: { create: () => Promise.resolve() },
                calls: () => { return { fetch: () => Promise.resolve() } }
            };
        } else {
            throw new Error();
        }
    },
    'fetch': {
        fetchUrl: (url, options, callback) => {
            callback(null, null, `{"incoming_phone_numbers": ${JSON.stringify(serviceRestApiNumber)}}`);
        }
    },
});

const { ServicesOptions, TwilioOptions } = require('../library/models/services-options');
const { CallOptions } = require('../library/models/call-options');
const { NumberOptions } = require('../library/models/number-options');

let serviceRestApiNumber = [];
const validOptions = new ServicesOptions({
    twilio: new TwilioOptions({
        accountSid: 'aAccountSid',
        authToken: 'aAuthToken',
        numbers: ['aPhoneNumber']
    })
});

describe('provider twilio', () => {
    describe('when initializing the twilio rest client', () => {
        it('with config should not throw error', () => {
            expect(() => {
                twilio.initialize(validOptions);
            }).to.not.throw();
        });

        it('without config should throw error', () => {
            const options = new ServicesOptions();

            expect(() => {
                twilio.initialize(options);
            }).to.throw();
        });
    });

    describe('when make a phone call with twilio rest client', () => {
        beforeEach(() => {
            twilio.initialize(validOptions);
        });

        it('without options should throw error', () => {
            expect(() => { new CallOptions(); }).to.throw();
        });

        it('with options should not throw error', () => {
            const callOptions = new CallOptions({
                calleeNumber: 'aPhoneNumber',
            });
            
            twilio.createCall(callOptions).then(() => {
                done();
            }).catch(() => {
                done(new Error('Expected method to be accepted'));
            });            
        });
    });

    describe('when get information on a call with twilio rest client', () => {
        beforeEach(() => {
            twilio.initialize(validOptions);
        });

        it('should not throw error', () => {
            twilio.getCallInformation('aCallSID').then((options) => {
                done();
            }).catch(() => {
                done(new Error('Expected method to be accepted'));
            });
        });
    });

    describe('when get number options with twilio rest client', () => {
        beforeEach(() => {
            twilio.initialize(validOptions);
        });

        it('without number should throw error', (done) => {
            serviceRestApiNumber = [];
            twilio.getNumberOptions().then((options) => {
                done(new Error('Expected method to be rejected'));
            }).catch(() => {
                done();
            });
        });

        it('with number should return a NumberOptions', async() => {
            serviceRestApiNumber = [{
                capabilities: { voice: true }
            }];
            const options = await twilio.getNumberOptions();
            assert.instanceOf(options, NumberOptions);
        });
    });
});
