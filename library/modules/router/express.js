const router = require('express').Router();
const { CallsMakerOptions } = require('../../models/calls-maker-options');
const generic = require('../controller/generic');
const signalwire = require('../controller/signalwire');
const twilio = require('../controller/twilio');

const generateGenericRouter = (options) => {
    const audioCallback = generic.getAudio(options.getAudioPathFile);

    router.get('/', options.corsOptions || generic.getRoot, generic.getRoot);
    router.get('/audio/:id', options.corsOptions || audioCallback, audioCallback);
    router.get('/audio/:id/:filename', options.corsOptions || audioCallback, audioCallback);
}

const generateSignalwireRouter = (options) => {
    const signalwireEventCallback = signalwire.receivingEvent(options.receivingEvent);
    const signalwireErrorCallback = signalwire.receivingError(options.receivingError);
    const signalwireReceiveCallCallback = signalwire.receivingCall(options.receivingCall);

    router.post('/signalwire/:id/event', options.corsOptions || signalwireEventCallback, signalwireEventCallback);
    router.post('/signalwire/:id/error/:error', options.corsOptions || signalwireErrorCallback, signalwireErrorCallback);
    router.post('/signalwire/receiving/call', options.corsOptions || signalwireReceiveCallCallback, signalwireReceiveCallCallback);

    options.customML.forEach(customXml => {
        const customCallback = signalwire.createReceivingCustom(customXml.action);
        router.post(`/signalwire/:id/${customXml.url}`, options.corsOptions || customCallback, customCallback);
    });
}

const generateTwilioRouter = (options) => {
    const twilioEventCallback = twilio.receivingEvent(options.receivingEvent);
    const twilioErrorCallback = twilio.receivingError(options.receivingError);
    const twilioReceiveCallCallback = twilio.receivingCall(options.receivingCall);

    router.post('/twilio/:id/event', options.corsOptions || twilioEventCallback, twilioEventCallback);
    router.post('/twilio/:id/error/:error', options.corsOptions || twilioErrorCallback, twilioErrorCallback);
    router.post('/twilio/receiving/call', options.corsOptions || twilioReceiveCallCallback, twilioReceiveCallCallback);

    options.customML.forEach(customXml => {
        const customCallback = twilio.createReceivingCustom(customXml.action);
        router.post(`/twilio/:id/${customXml.url}`, options.corsOptions || customCallback, customCallback);
    });
}

module.exports = (options = new CallsMakerOptions()) => {
    generateGenericRouter(options);
    generateSignalwireRouter(options);
    generateTwilioRouter(options);

    return router;
};
