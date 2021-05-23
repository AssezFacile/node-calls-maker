const fetchUrl = require('fetch').fetchUrl;
const { ServicesOptions } = require('../../models/services-options');
const { CallOptions } = require('../../models/call-options');
const { NumberOptions } = require('../../models/number-options');
const { CallInformation } = require('../../models/calls-maker-result');
const { ClientService } = require('../../models/client-service');

let client = null;
let servicesOptions = null;
const numberOptions = new NumberOptions();

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
};

const getHeaders = () => {
    const token = Buffer.from(`${servicesOptions.twilio.accountSid}:${servicesOptions.twilio.authToken}`);

    return {
        Authorization: `Basic ${token.toString('base64')}`
    };
};

const retrievePhoneNumbers = () => {
    return new Promise((resolve, reject) => {
        fetchUrl(`https://api.twilio.com/2010-04-01/Accounts/${servicesOptions.twilio.accountSid}/IncomingPhoneNumbers.json`, {
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
                    return reject(new Error('No number is setup on your twilio account'));
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
