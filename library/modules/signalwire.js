const { ServicesOptions } = require('../models/services-options');
const { CallOptions } = require('../models/call-options');

let client = null;
let servicesOptions = null;

exports.initialize = (options = new ServicesOptions()) => {
    servicesOptions = options;

    const { RestClient } = require('@signalwire/node');

    client = new RestClient(options.signalwire.accountSid, options.signalwire.authToken, {
        signalwireSpaceUrl: options.signalwire.spaceUrl
    });
}

exports.call = (options = new CallOptions()) => {
    return new Promise((resolve, reject) => {
        client.calls.create({
            url: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/signalwire/${options.id}/${options.xmlFileUrl}`,
            callerId: options.callerId,
            from: options.callerNumber,
            to: options.calleeNumber,
            //sendDigits: productionByBranch.branch.extension || null,
            record: options.isRecording,
            trim: 'do-not-trim',
            statusCallback: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/signalwire/${options.id}/event`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            statusCallbackMethod: 'POST',
            fallbackUrl: `${servicesOptions.externalHost}${servicesOptions.basicUrl}/signalwire/${options.id}/error/fallback-url`,
            fallbackMethod: 'POST'
        }).then(message => {
            resolve(message);
        }).catch(error => {
            reject(error);
        });
    });
};