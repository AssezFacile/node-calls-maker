const { expect } = require('chai');
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
});

const { ServicesOptions, TwilioOptions } = require('../library/models/services-options');
const { CallOptions } = require('../library/models/call-options');

const validOptions = new ServicesOptions({
    twilio: new TwilioOptions({
        accountSid: 'aAccountSid',
        authToken: 'aAuthToken',
        numbers: ['aPhoneNumber']
    })
});

describe('provider twilio', () => {
    describe('when initializing the twilo rest client', () => {
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

        it('with options should not throw error', () => {
            expect(() => {
                twilio.createCall(new CallOptions({
                    calleeNumber: 'aPhoneNumber',
                }));
            }).to.not.throw();
        });

        it('without options should throw error', () => {
            expect(() => {
                twilio.createCall(new CallOptions());
            }).to.throw();
        });
    });

    describe('when get information on a call with twilio rest client', () => {
        beforeEach(() => {
            twilio.initialize(validOptions);
        });

        it('should not throw error', () => {
            expect(() => {
                twilio.getCallInformation('aCallSID');
            }).to.not.throw();
        });
    });
});
