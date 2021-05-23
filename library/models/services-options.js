class SignalwireOptions {
    accountSid = '';
    authToken = '';
    spaceUrl = '';
    callerId = '';
    numbers = [];

    constructor(obj = {}) {
        obj.numbers = obj.numbers || [];
        obj.callerId = obj.callerId || obj.numbers[0] || '';

        Object.assign(this, obj);
    }
}

class TwilioOptions {
    accountSid = '';
    authToken = '';
    callerId = '';
    numbers = [];

    constructor(obj = {}) {
        obj.numbers = obj.numbers || [];
        obj.callerId = obj.callerId || obj.numbers[0] || '';

        Object.assign(this, obj);
    }
}

class ServicesOptions {
    externalHost = '';
    basicUrl = 'calls-maker';
    signalwire = new SignalwireOptions();
    twilio = new TwilioOptions();

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}

exports.ServicesOptions = ServicesOptions;
exports.SignalwireOptions = SignalwireOptions;
exports.TwilioOptions = TwilioOptions;
