class CallOptions {
    id = '';
    xmlFileUrl = '';
    calleeNumber = '';
    calleeExtension = '';
    isRecording = false;

    constructor(obj = {}) {
        obj.id = obj.id || (new Date()).getTime();

        if (!obj.calleeNumber) {
            throw new Error('You need at least a "calleeNumber"');
        }

        Object.assign(this, obj);
    }
}

exports.CallOptions = CallOptions;
