class SignalwireOptions {
    accountSid = '';
    authToken = '';
    spaceUrl = '';

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}

class TwilioOptions {
    accountSid = '';
    authToken = '';

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}

class ServicesOptions {
    externalHost = '';
    basicUrl = '';
    signalwire = new SignalwireOptions();
    twilio = new TwilioOptions();

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}

exports.ServicesOptions = ServicesOptions;
exports.SignalwireOptions = SignalwireOptions;
exports.TwilioOptions = TwilioOptions;
