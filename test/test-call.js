const { assert, expect } = require('chai');
const { CallOptions } = require('../library/models/call-options');
const { CallInformation, CallsMakerResult } = require('../library/models/calls-maker-result');
const call = require('proxyquire')('../library/modules/call', {
    './client': {
        getClients: () => [{
            client: { createCall: () => Promise.resolve({}) }
        }]
    }
});

describe('call', () => {
    describe('when get call information', () => {
        it('should return a "CallInformation" instance', async () => {
            const callInformation = await call.getInfo('aCallSid');
            assert.instanceOf(callInformation, CallInformation);
        });
    });

    describe('when create call', () => {
        it('without phone number should throw a error', async () => {
            expect(() => {
                call.create(new CallOptions());
            }).to.throw();
        });
        
        it('with options should return a "CallsMakerResult" instance', async () => {
            const result = await call.create(new CallOptions({
                calleeNumber: 'aPhoneNumber'
            }));

            assert.instanceOf(result, CallsMakerResult);
        });
    });
});
