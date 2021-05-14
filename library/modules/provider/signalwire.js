const { ServicesOptions } = require('../../models/services-options');
const { CallOptions } = require('../../models/call-options');
const { ClientService } = require('../../models/client-service');
const { CallInformation } = require('../../models/calls-maker-result');

let client = null;
let servicesOptions = null;

const buildCompleteCallOptions = (options) => {
    const data = {
        url: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/signalwire/${options.id}/${options.xmlFileUrl}`,
        callerId: servicesOptions.signalwire.callerId,
        from: servicesOptions.signalwire.numbers[0],
        to: options.calleeNumber,
        record: options.isRecording,
        trim: 'do-not-trim',
        statusCallback: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/signalwire/${options.id}/event`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
        fallbackUrl: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/signalwire/${options.id}/error/fallback-url`,
        fallbackMethod: 'POST'
    };

    if (options.calleeExtension) {
        data.sendDigits = options.calleeExtension;
    }

    return data;
};

exports.initialize = (options = new ServicesOptions()) => {
    const { RestClient } = require('@signalwire/node');

    servicesOptions = options;
    client = new RestClient(options.signalwire.accountSid, options.signalwire.authToken, {
        signalwireSpaceUrl: options.signalwire.spaceUrl
    });
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

exports.getCallInformation = (callSid) => {
    return new Promise((resolve, reject) => {
        client.calls(callSid).fetch().then((data) => {
            resolve(new CallInformation({
                serviceUse: ClientService.SIGNALWIRE,
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