const { ServicesOptions } = require('../models/services-options');
const { CallOptions } = require('../models/call-options');

let client = null;
let servicesOptions = null;

const buildCompleteCallOptions = (options) => {
    const data = {
        url: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/twilio/${options.id}/${options.xmlFileUrl}`,
        callerId: servicesOptions.twilio.callerId,
        from: servicesOptions.twilio.numbers[0],
        to: options.calleeNumber,
        record: options.isRecording,
        trim: 'do-not-trim',
        statusCallback: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/twilio/${options.id}/event`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
        fallbackUrl: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/twilio/${options.id}/error/fallback-url`,
        fallbackMethod: 'POST'
    };

    if (options.calleeExtension) {
        data.sendDigits = options.calleeExtension;
    }

    return data;
};

exports.initialize = (options = new ServicesOptions()) => {
    servicesOptions = options;
    client = require('twilio')(options.twilio.accountSid, options.twilio.authToken);
}

exports.call = (options = new CallOptions()) => {
    const callOptions = buildCompleteCallOptions(options);

    return new Promise((resolve, reject) => {
        client.calls.create(callOptions).then(message => {
            resolve(message);
        }).catch(error => {
            reject(error);
        });
    });
};