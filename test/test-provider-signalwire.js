const { expect } = require('chai');
const signalwire = require('proxyquire')('../library/modules/provider/signalwire', {
    '@signalwire/node': {
        RestClient: function(accountSid) {
            if (accountSid) {
                return {
                    calls: { create: () => Promise.resolve() },
                    calls: () => { return { fetch: () => Promise.resolve() } }
                };
            } else {
                throw new Error();
            }
        }
    },
});

const { ServicesOptions, SignalwireOptions } = require('../library/models/services-options');
const { CallOptions } = require('../library/models/call-options');

const validOptions = new ServicesOptions({
    signalwire: new SignalwireOptions({
        accountSid: 'aAccountSid',
        authToken: 'aAuthToken',
        spaceUrl: 'aSpaceUrl',
        numbers: ['aPhoneNumber']
    })
});

describe('provider signalwire', () => {
    describe('when initializing the signalwire rest client', () => {
        it('with config should not throw error', () => {
            expect(() => {
                signalwire.initialize(validOptions);
            }).to.not.throw();
        });

        it('without config should throw error', () => {
            const options = new ServicesOptions();

            expect(() => {
                signalwire.initialize(options);
            }).to.throw();
        });
    });

    describe('when make a phone call with signalwire rest client', () => {
        beforeEach(() => {
            signalwire.initialize(validOptions);
        });

        it('with options should not throw error', () => {
            expect(() => {
                signalwire.createCall(new CallOptions({
                    calleeNumber: 'aPhoneNumber',
                }));
            }).to.not.throw();
        });

        it('without options should throw error', () => {
            expect(() => {
                signalwire.createCall(new CallOptions());
            }).to.throw();
        });
    });

    describe('when get information on a call with signalwire rest client', () => {
        beforeEach(() => {
            signalwire.initialize(validOptions);
        });

        it('should not throw error', () => {
            expect(() => {
                signalwire.getCallInformation('aCallSID');
            }).to.not.throw();
        });
    });
});
