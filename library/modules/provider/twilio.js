const { ServicesOptions } = require('../../models/services-options');
const { CallOptions } = require('../../models/call-options');
const { CallInformation } = require('../../models/calls-maker-result');
const { ClientService } = require('../../models/client-service');

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

exports.createCall = (options = new CallOptions()) => {
    const callOptions = buildCompleteCallOptions(options);

    return new Promise((resolve, reject) => {
        client.calls.create(callOptions).then(message => {
            resolve(message);
        }).catch(error => {
            reject(error);
        });
    });
};

exports.getCallInformation = async (callSid) => {
    return new Promise((resolve, reject) => {
        client.calls(callSid).fetch().then((data) => {
            resolve(new CallInformation({
                serviceUse: ClientService.TWILIO,
                serviceResponse: data,
                id: data.sid,
                to: data.to,
                from: data.from,
                price: Math.abs(data.price),
                duration: data.duration,
            }));
        }).catch((error) => {
            reject(error);
        });
    });
}