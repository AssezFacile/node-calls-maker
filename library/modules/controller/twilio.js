exports.receivingEvent = (callback) => {
    return (req, res) => {
        callback(req.params, req.body);
        return res.status(204).send();
    };
};

exports.receivingError = (callback) => {
    return (req, res) => {
        callback(req.params, req.body);
        return res.status(204).send();
    };
};

exports.createReceivingCustom = (getVoiceResponse) => {
    return (req, res) => {
        return res.send(getVoiceResponse(req.params));
    };
};