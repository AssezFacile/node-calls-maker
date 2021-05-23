const fetchUrl = require('fetch').fetchUrl;
const { ServicesOptions } = require('../../models/services-options');
const { CallOptions } = require('../../models/call-options');
const { NumberOptions } = require('../../models/number-options');
const { ClientService } = require('../../models/client-service');
const { CallInformation } = require('../../models/calls-maker-result');

let client = null;
let servicesOptions = null;
const numberOptions = new NumberOptions();

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
};

const retrieveAccountInformation = () => {
    return new Promise((resolve, reject) => {
        client.api.accounts(servicesOptions.signalwire.accountSid).fetch()
            .then(account => resolve(account))
            .catch(error => reject(error))
            .done();
    });
};

const getHeaders = () => {
    const token = Buffer.from(`${servicesOptions.signalwire.accountSid}:${servicesOptions.signalwire.authToken}`);

    return {
        Authorization: `Basic ${token.toString('base64')}`
    };
};

const retrieveApplications = () => {
    return new Promise((resolve, reject) => {
        fetchUrl(`https://${servicesOptions.signalwire.spaceUrl}/api/laml/2010-04-01/Accounts/${servicesOptions.signalwire.accountSid}/Applications.json`, {
            headers: getHeaders()
        }, (error, meta, body) => {
            if (error) {
                reject(error);
            } else {
                const result = JSON.parse(body.toString());
                resolve(result.applications);
            }
        });
    });
};

const availablePhoneNumbers = () => {
    return new Promise((resolve, reject) => {
        fetchUrl(`https://${servicesOptions.signalwire.spaceUrl}/api/laml/2010-04-01/Accounts/${servicesOptions.signalwire.accountSid}/AvailablePhoneNumbers.json`, {
            headers: getHeaders()
        }, (error, meta, body) => {
            if (error) {
                reject(error);
            } else {
                const result = JSON.parse(body.toString());
                resolve(result.countries);
            }
        });
    });
};

const retrievePhoneNumbers = () => {
    return new Promise((resolve, reject) => {
        fetchUrl(`https://${servicesOptions.signalwire.spaceUrl}/api/laml/2010-04-01/Accounts/${servicesOptions.signalwire.accountSid}/IncomingPhoneNumbers.json`, {
            headers: getHeaders()
        }, (error, meta, body) => {
            if (error) {
                reject(error);
            } else {
                const result = JSON.parse(body.toString());
                resolve(result.incoming_phone_numbers);
            }
        });
    });
};

exports.getNumberOptions = () => {
    return new Promise((resolve, reject) => {
        if (numberOptions.active) {
            resolve(numberOptions);
        } else {
            retrievePhoneNumbers().then(numbers => {
                if (!numbers.length) {
                    reject(new Error('No number is setup on your signalwire account'));
                }

                numberOptions.outgoingVoice = numbers.some(number => number.capabilities.voice);
                numberOptions.outgoingSms = numbers.some(number => number.capabilities.sms);
                numberOptions.outgoingMms = numbers.some(number => number.capabilities.mms);
                numberOptions.outgoingFax = numbers.some(number => number.capabilities.fax);
                numberOptions.incomingVoice = numbers.some(number => number.voice_url && number.voice_url.indexOf(`${servicesOptions.externalHost}`) > -1);
                numberOptions.incomingSms = numbers.some(number => number.sms_url && number.sms_url.indexOf(`${servicesOptions.externalHost}`) > -1);

                resolve(numberOptions);
            });
        }
    });
};
