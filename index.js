const { CallOptions } = require('./library/models/call-options');
const { CallsMakerOptions, CallsCustomML } = require('./library/models/calls-maker-options');
const { CallsMakerResult } = require('./library/models/calls-maker-result');
const { ServicesOptions, SignalwireOptions, TwilioOptions } = require('./library/models/services-options');

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

exports.ml = require('./library/modules/ml');
exports.client = require('./library/modules/client');
exports.call = require('./library/modules/call');
