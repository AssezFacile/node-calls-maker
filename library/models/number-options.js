class NumberOptions {
    active = false;
    _outgoingVoice = false;
    _outgoingSms = false;
    _outgoingMms = false;
    _outgoingFax = false;
    _incomingVoice = false;
    _incomingSms = false;

    get outgoingVoice() { return this._outgoingVoice; };
    set outgoingVoice(value) {
        this.active = true;
        this._outgoingVoice = value;
    }

    get outgoingSms() { return this._outgoingSms; };
    set outgoingSMs(value) {
        this.active = true;
        this._outgoingSms = value;
    }

    get outgoingMms() { return this._outgoingMms; };
    set outgoingMms(value) {
        this.active = true;
        this._outgoingMms = value;
    }

    get outgoingFax() { return this._outgoingFax; };
    set outgoingFax(value) {
        this.active = true;
        this._outgoingFax = value;
    }

    get incomingVoice() { return this._incomingVoice; };
    set incomingVoice(value) {
        this.active = true;
        this._incomingVoice = value;
    }

    get incomingSms() { return this._incomingSms; };
    set incomingSms(value) {
        this.active = true;
        this._incomingSms = value;
    }

    constructor(obj = {}) {
        Object.assign(this, obj);
    }
}

exports.NumberOptions = NumberOptions;
