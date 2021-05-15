const { assert } = require('chai');
const { ClientService } = require('../library/models/client-service');
const aHost = 'http://aHost/aBasicUrl';
const GenericMl = require('../library/modules/provider/generic-ml');
const VoiceResponseSignalwire = require('@signalwire/node').RestClient.LaML.VoiceResponse;
const VoiceResponseTwilio = require('twilio').twiml.VoiceResponse;
let ml = null;

describe('ml', () => {
    describe('when no service is initialize', () => {
        beforeEach(() => {            
            ml = require('proxyquire')('../library/modules/ml', {
                './client': {
                    getHost: () => aHost,
                    serviceIsInitialize: () => false
                }
            });
        });

        it('VoiceResponse should return GenericMl', () => {
            const voiceResponse = new ml.VoiceResponse();
            assert.instanceOf(voiceResponse, GenericMl);
        });

        it('redirect on VoiceResponse should create tag for calls-maker', () => {
            const aXmlUrl = 'aXmlUrl';
            const voiceResponse = new ml.VoiceResponse();
            voiceResponse.redirect(aXmlUrl);

            assert.strictEqual(
                voiceResponse.toString(),
                `<?xml version="1.0" encoding="UTF-8"?><Response><Redirect method="POST">${aHost}/{service-path}/${aXmlUrl}</Redirect></Response>`
            );
        });
    });

    describe('when SIGNALWIRE is initialize', () => {
        beforeEach(() => {
            ml = require('proxyquire')('../library/modules/ml', {
                './client': {
                    getHost: () => aHost,
                    serviceIsInitialize: (service) => (service) => service === ClientService.SIGNALWIRE
                }
            });
        });

        it('VoiceResponse should return VoiceResponse from Signalwire', () => {
            const voiceResponse = new ml.VoiceResponse();
            assert.instanceOf(voiceResponse, VoiceResponseSignalwire);
        });

        it('redirect on VoiceResponse should create tag for calls-maker', () => {
            const aXmlUrl = 'aXmlUrl';
            const voiceResponse = new ml.VoiceResponse();
            voiceResponse.redirect(aXmlUrl);

            assert.strictEqual(
                voiceResponse.toString(),
                `<?xml version="1.0" encoding="UTF-8"?><Response><Redirect method="POST">${aHost}/{service-path}/${aXmlUrl}</Redirect></Response>`
            );
        });
    });

    describe('when TWILIO is initialize', () => {
        beforeEach(() => {
            ml = require('proxyquire')('../library/modules/ml', {
                './client': {
                    getHost: () => aHost,
                    serviceIsInitialize: (service) => (service) => service === ClientService.TWILIO
                }
            });
        });

        it('VoiceResponse should return VoiceResponse from Twilio', () => {
            const voiceResponse = new ml.VoiceResponse();
            assert.instanceOf(voiceResponse, VoiceResponseTwilio);
        });

        it('redirect on VoiceResponse should create tag for calls-maker', () => {
            const aXmlUrl = 'aXmlUrl';
            const voiceResponse = new ml.VoiceResponse();
            voiceResponse.redirect(aXmlUrl);

            assert.strictEqual(
                voiceResponse.toString(),
                `<?xml version="1.0" encoding="UTF-8"?><Response><Redirect method="POST">${aHost}/{service-path}/${aXmlUrl}</Redirect></Response>`
            );
        });
    });
});
