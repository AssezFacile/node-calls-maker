const { CallOptions } = require('./library/models/call-options');
const { CallsMakerOptions, CallsCustomML } = require('./library/models/calls-maker-options');
const { CallsMakerResult } = require('./library/models/calls-maker-result');
const { ClientService } = require('./library/models/client-service');
const { ServicesOptions, SignalwireOptions, TwilioOptions } = require('./library/models/services-options');

const clientsRestApi = [];
const serviceIsInitialize = (clientService) => {
    return clientsRestApi.findIndex(api => api.service === clientService) > -1;
}

exports.CallsMakerResult = CallsMakerResult;
exports.CallsMakerOptions = CallsMakerOptions;
exports.CallsCustomML = CallsCustomML;
exports.CallOptions = CallOptions;
exports.ServicesOptions = ServicesOptions;
exports.SignalwireOptions = SignalwireOptions;
exports.TwilioOptions = TwilioOptions;

exports.expressJs = {
    getRouter: (options = new CallsMakerOptions()) => {
        return require('./library/modules/router/express')(options);
    }
};

exports.ml = {
    get VoiceResponse() {
        try {
            if (serviceIsInitialize(ClientService.SIGNALWIRE)) {
                return require('@signalwire/node').RestClient.LaML.VoiceResponse;
            } else if (serviceIsInitialize(ClientService.TWILIO)) {
                return require('twilio').twiml.VoiceResponse;
            }
        } catch(e) {
            return require('./library/modules/generic-ml');
        }
    }
}

exports.calls = {
    initialize: (options = new ServicesOptions()) => {
        if (options.signalwire.accountSid) {
            const client = require('./library/modules/signalwire');
            client.initialize(options);

            clientsRestApi.push({
                service: ClientService.SIGNALWIRE,
                client: client,
            });
        }
        if (options.twilio.accountSid) {
            const client = require('./library/modules/twilio');
            client.initialize(options);

            clientsRestApi.push({
                service: ClientService.TWILIO,
                client: client,
            });
        }

        if (!clientsRestApi.length) {
            throw new Error('You need to config at least one service');
        }
    },
    call: (options = new CallOptions()) => {
        const errors = [];
        let response = null;

        return new Promise(async (resolve, reject) => {
            for (let i = 0, j = clientsRestApi.length; i < j; i++) {
                try {
                    response = await clientsRestApi[i].client.call(options);

                    if (response) {
                        resolve(new CallsMakerResult({
                            success: true,
                            serviceUse: clientsRestApi[i].service,
                            serviceResponse: response,
                            errors: errors
                        }));
                        break;
                    }
                } catch(error) {
                    errors.push(error);
                }
            }

            reject(new CallsMakerResult({
                success: false,
                errors: errors,
            }));
        });
    }
};
