const { expect } = require('chai');
const signalwire = require('../library/modules/signalwire');
const { ServicesOptions, SignalwireOptions } = require('../library/models/services-options');
const { CallOptions } = require('../library/models/call-options');

describe('signalwire', () => {
    describe('when initializing the signalwire rest client', () => {
        it('with config should not throw error', () => {
            const options = new ServicesOptions({
                signalwire: new SignalwireOptions({
                    accountSid: 'aAccountSid',
                    authToken: 'aAuthToken',
                    spaceUrl: 'aSpaceUrl'
                })
            });

            expect(() => {
                signalwire.initialize(options);
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
        it('should not throw error', () => {
            signalwire.call(new CallOptions({
                callerNumber: 'aPhoneNumber',
                calleeNumber: 'aPhoneNumber',
            }));
        });
    });
});
