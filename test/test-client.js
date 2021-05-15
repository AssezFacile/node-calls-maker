const { assert, expect } = require('chai');
const { ServicesOptions, SignalwireOptions } = require('../library/models/services-options');
const { ClientService } = require('../library/models/client-service');
const client = require('proxyquire')('../library/modules/client', {
    './provider/signalwire': {
        initialize: () => {}
    }
});

describe('client', () => {
    describe('when initialize the client', () => {
        it('without options should throw an error', () => {
            expect(() => {
                client.initialize(new ServicesOptions());
            }).to.throw();
        });

        it('with options should not throw error', () => {
            expect(() => {
                client.initialize(new ServicesOptions({
                    signalwire: new SignalwireOptions({
                        accountSid: 'anAccountSid',
                    })
                }));
            }).not.to.throw();
        });
    });

    describe('after initialization', () => {
        const aHost = 'aHost';
        const aBasicUrl = 'aBasicUrl';

        beforeEach(() => {
            client.initialize(new ServicesOptions({
                externalHost: aHost,
                basicUrl: aBasicUrl,
                signalwire: new SignalwireOptions({
                    accountSid: 'anAccountSid',
                })
            }));
        });

        it('getClients should return the list of initialized client', () => {
            assert.isArray(client.getClients());
        });

        it('getClient with not initialized service should return null', () => {
            const serviceClient = client.getClient(ClientService.TWILIO);

            assert.isNull(serviceClient);
        });

        it('getClient with initialized service should return the service REST client', () => {
            const serviceClient = client.getClient(ClientService.SIGNALWIRE);

            assert.isTrue('initialize' in serviceClient);
        });

        it('getHost should return an url', () => {
            const url = client.getHost();

            assert.strictEqual(url, `${aHost}${aBasicUrl}`);
        });

        it('serviceIsInitialize with not initialize service should return true', () => {
            const index = client.serviceIsInitialize(ClientService.TWILIO);

            assert.isFalse(index);
        });

        it('serviceIsInitialize with initialize service should return true', () => {
            const index = client.serviceIsInitialize(ClientService.SIGNALWIRE);

            assert.isTrue(index);
        });
    });
});
