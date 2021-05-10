const router = require('express').Router();
const { CallsMakerOptions } = require('../../models/calls-maker-options');
const generic = require('../controller/generic');
const signalwire = require('../controller/signalwire');

const generateRouter = (options = new CallsMakerOptions()) => {
    const audioCallback = generic.getAudio(options.getAudioPathFile);
    const eventCallback = signalwire.receivingEvent(options.receivingEvent);
    const errorCallback = signalwire.receivingError(options.receivingError);

    router.get('/', options.corsOptions || generic.getRoot, generic.getRoot);
    router.get('/audio/:id', options.corsOptions || audioCallback, audioCallback);
    router.get('/audio/:id/:filename', options.corsOptions || audioCallback, audioCallback);
    router.post('/signalwire/:id/event', options.corsOptions || eventCallback, eventCallback);
    router.post('/signalwire/:id/error/:error', options.corsOptions || errorCallback, errorCallback);

    options.customML.forEach(customXml => {
        const customCallback = signalwire.createReceivingCustom(customXml.action);
        router.post(`/signalwire/:id/${customXml.url}`, options.corsOptions || customCallback, customCallback);
    });

    return router;
}

module.exports = generateRouter;
