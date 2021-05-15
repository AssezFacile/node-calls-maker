class CallsMakerResult {
    success = false;
    serviceUse = '';
    serviceResponse = {};
    errors = [];

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
};

class CallInformation {
    serviceUse = null;
    serviceResponse = null;
    id = '';
    to = '';
    from = '';
    price = '';
    duration = '';

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}


exports.CallsMakerResult = CallsMakerResult;
exports.CallInformation = CallInformation;
