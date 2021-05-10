class CallsCustomML {
    url = '';
    action = () => {};

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}

class CallsMakerOptions {
    customML = [];
    corsOptions = null;
    getAudioPathFile = () => {};
    receivingEvent = () => {};
    receivingError = () => {};

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}

exports.CallsMakerOptions = CallsMakerOptions;
exports.CallsCustomML = CallsCustomML;