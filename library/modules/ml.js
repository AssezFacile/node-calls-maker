const { ClientService } = require('../models/client-service');
const { serviceIsInitialize } = require('./client');

module.exports = {
    get VoiceResponse() {
        try {
            if (serviceIsInitialize(ClientService.SIGNALWIRE)) {
                return require('@signalwire/node').RestClient.LaML.VoiceResponse;
            } else if (serviceIsInitialize(ClientService.TWILIO)) {
                return require('twilio').twiml.VoiceResponse;
            }
        } catch(e) {
            return require('./provider/generic-ml');
        }
    }
};