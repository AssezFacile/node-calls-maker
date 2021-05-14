exports.receivingEvent = (callback) => {
    return (req, res) => {
        callback(req.params, req.body).then((response) => {
            if (response) {
                res.status(200).send(response);
            } else {
                res.status(204).send();
            }
        });
    };
};

exports.receivingError = (callback) => {
    return (req, res) => {
        callback(req.params, req.body).then((response) => {
            if (response) {
                res.status(200).send(response);
            } else {
                res.status(204).send();
            }
        });
    };
};

exports.createReceivingCustom = (getVoiceResponse) => {
    return (req, res) => {
        getVoiceResponse(req.params).then((response) => {
            res.send(response);
        });
    };
};