const { expect, assert } = require('chai');
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
    'fetch': {
        fetchUrl: (url, options, callback) => {
            callback(null, null, `{"incoming_phone_numbers": ${JSON.stringify(serviceRestApiNumber)}}`);
        }
    }
});

const { ServicesOptions, SignalwireOptions } = require('../library/models/services-options');
const { CallOptions } = require('../library/models/call-options');
const { NumberOptions } = require('../library/models/number-options');

let serviceRestApiNumber = [];
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

        it('without options should throw error', () => {
            expect(() => { new CallOptions(); }).to.throw();
        });

        it('with options should not throw error', () => {
            const callOptions = new CallOptions({
                calleeNumber: 'aPhoneNumber',
            });
            
            signalwire.createCall(callOptions).then(() => {
                done();
            }).catch(() => {
                done(new Error('Expected method to be accepted'));
            });            
        });
    });

    describe('when get information on a call with signalwire rest client', () => {
        beforeEach(() => {
            signalwire.initialize(validOptions);
        });

        it('should not throw error', () => {
            signalwire.getCallInformation('aCallSID').then((options) => {
                done();
            }).catch(() => {
                done(new Error('Expected method to be accepted'));
            });
        });
    });

    describe('when get number options with signalwire rest client', () => {
        beforeEach(() => {
            signalwire.initialize(validOptions);
        });

        it('without number should throw error', (done) => {
            serviceRestApiNumber = [];
            signalwire.getNumberOptions().then((options) => {
                done(new Error('Expected method to be rejected'));
            }).catch(() => {
                done();
            });
        });

        it('with number should return a NumberOptions', async() => {
            serviceRestApiNumber = [{
                capabilities: { voice: true }
            }];
            const options = await signalwire.getNumberOptions();
            assert.instanceOf(options, NumberOptions);
        });
    });
});
