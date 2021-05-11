class CallOptions {
    id = '';
    xmlFileUrl = '';
    calleeNumber = '';
    calleeExtension = '';
    isRecording = false;

    constructor(obj = {}) {
        obj.id = obj.id || (new Date()).getTime();

        Object.assign(this, obj);
    }
}

exports.CallOptions = CallOptions;
