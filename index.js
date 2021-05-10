const { CallOptions } = require('./library/models/call-options');
const { CallsMakerOptions } = require('./library/models/calls-maker-options');
const { ServicesOptions, SignalwireOptions, TwilioOptions } = require('./library/models/services-options');
let clientRest = null;
let clientType = null;

exports.CallsMakerOptions = CallsMakerOptions;
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
        if (clientType === 'signalwire') {
            return require('@signalwire/node').RestClient.LaML.VoiceResponse;
        }
    }
}

exports.calls = {
    initialize: (options = new ServicesOptions()) => {
        if (options.signalwire.accountSid) {
            clientType = 'signalwire';
            clientRest = require('./library/modules/signalwire');
            clientRest.initialize(options);

            return;
        }

        throw new Error('You need to config at least one service');
    },
    call: (options = new CallOptions()) => {
        return clientRest.call(options);
    }
};
