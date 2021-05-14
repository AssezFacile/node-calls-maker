const { ClientService } = require('../models/client-service');
const { serviceIsInitialize, getHost } = require('./client');

const customRedirect = function(options, url) {
    if (typeof(options) === 'string') {
        url = options;
        options = {};
    }

    options = Object.assign({ method: 'POST' }, options);
    if (url.indexOf('://') > -1) {
        return this.originalRedirect(options, url);
    }

    return this.originalRedirect(options, `${getHost()}/{service-path}/${url}`);
};

module.exports = {
    get VoiceResponse() {
        let voiceResponse = null;
        
        if (serviceIsInitialize(ClientService.SIGNALWIRE)) {
            voiceResponse = require('@signalwire/node').RestClient.LaML.VoiceResponse;
        } else if (serviceIsInitialize(ClientService.TWILIO)) {
            voiceResponse = require('twilio').twiml.VoiceResponse;
        } else {
            voiceResponse = require('./provider/generic-ml');
        }

        voiceResponse.prototype.originalRedirect = voiceResponse.prototype.redirect;
        voiceResponse.prototype.redirect = customRedirect;
        return voiceResponse;
    }
};