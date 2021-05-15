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

const resetSomeBasicMethod = () => {
    if (typeof(usedVoiceResponse) === 'Function') {
        usedVoiceResponse.prototype.originalRedirect = usedVoiceResponse.prototype.redirect;
        usedVoiceResponse.prototype.redirect = customRedirect;
    } else {
        class CustomMl extends (usedVoiceResponse) {
            constructor() {
                super();
                this.originalRedirect = this.redirect;
                this.redirect = customRedirect;
            }
        }

        usedVoiceResponse = CustomMl;
    }
}

let usedVoiceResponse = null;

module.exports = {
    get VoiceResponse() {
        if (usedVoiceResponse) {
            return usedVoiceResponse;
        } else if (serviceIsInitialize(ClientService.SIGNALWIRE)) {
            usedVoiceResponse = require('@signalwire/node').RestClient.LaML.VoiceResponse;
        } else if (serviceIsInitialize(ClientService.TWILIO)) {
            usedVoiceResponse = require('twilio').twiml.VoiceResponse;
        } else {
            usedVoiceResponse = require('./provider/generic-ml');
        }

        resetSomeBasicMethod();
        return usedVoiceResponse;
    }
};