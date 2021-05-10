class CallOptions {
    id = '';
    xmlFileUrl = '';
    callerId = '';
    callerNumber = '';
    calleeNumber = '';
    isRecording = false;

    constructor(obj = {}) {
        obj.id = obj.id || (new Date()).getTime();
        Object.assign(this, obj);
    }
}

exports.CallOptions = CallOptions;
