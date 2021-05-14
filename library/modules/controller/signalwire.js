exports.receivingEvent = (callback) => {
    return (req, res) => {
        const response = callback(req.params, req.body);

        if (response) {
            return res.status(200).send(response);
        } else {
            return res.status(204).send();
        }
    };
};

exports.receivingError = (callback) => {
    return (req, res) => {
        const response = callback(req.params, req.body);

        if (response) {
            return res.status(200).send(response);
        } else {
            return res.status(204).send();
        }
    };
};

exports.createReceivingCustom = (getVoiceResponse) => {
    return (req, res) => {
        return res.send(getVoiceResponse(req.params));
    };
};