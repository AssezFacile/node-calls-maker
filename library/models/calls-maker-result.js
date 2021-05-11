class CallsMakerResult {
    success = false;
    serviceUse = null;
    serviceResponse = {};
    errors = null;

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
};

exports.CallsMakerResult = CallsMakerResult;