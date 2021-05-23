const convertResponseToString = (response) => {
    const body = response.toString();
    return body.replace(/\{service-path\}/ig, 'twilio');
};

exports.receivingEvent = (callback) => {
    return (req, res) => {
        callback(req.query, req.params, req.body).then((response) => {
            if (response) {
                res.status(200).send(convertResponseToString(response));
            } else {
                res.status(204).send();
            }
        });
    };
};

exports.receivingError = (callback) => {
    return (req, res) => {
        callback(req.query, req.params, req.body).then((response) => {
            if (response) {
                res.status(200).send(convertResponseToString(response));
            } else {
                res.status(204).send();
            }
        });
    };
};

exports.receivingCall = (callback) => {
    return (req, res) => {
        callback(req.query, req.params, req.body).then((response) => {
            if (response) {
                res.status(200).send(convertResponseToString(response));
            } else {
                res.status(204).send();
            }
        });
    };
};

exports.createReceivingCustom = (getVoiceResponse) => {
    return (req, res) => {
        getVoiceResponse(req.query, req.params, req.body).then((response) => {
            res.send(convertResponseToString(response));
        });
    };
};