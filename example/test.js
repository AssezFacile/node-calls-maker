const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const HOST = `http://209.171.160.246:${PORT}`;
const { expressJs, ml, calls, CallsMakerOptions } = require('../index');
const { SignalwireOptions, ServicesOptions } = require('../library/models/services-options');
const { CallOptions } = require('../library/models/call-options');
const { CallsCustomML } = require('../library/models/calls-maker-options');
const options = new CallsMakerOptions({
    getAudioPathFile: (params) => {
        return `${__dirname}/audio.mp3`;
    },
    receivingEvent: (params, body) => {
        console.log('receiving event', params, body);
    },
    receivingError: (params, body) => {
        console.log('receiving error', params, body);
    },
    customML: [
        new CallsCustomML({
            url: 'main-call',
            action: (params) => {
                const response = new ml.VoiceResponse();
                response.say('Hello world!');
                response.pause(2);
                response.play(`${HOST}/calls-maker/audio/-specific-id-/audio.mp3`);
                response.hangup();

                return response.toString();
            }
        })
    ],
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/calls-maker', expressJs.getRouter(options));
app.get('/', (req, res) => { res.send('example api!'); });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

calls.initialize(new ServicesOptions({
    externalHost: HOST,
    basicUrl: '/calls-maker',
    signalwire: new SignalwireOptions({
        accountSid: 'd1e89cc8-45e7-43d3-a4c5-7376479636b2', // your signalwire project sid
        authToken: 'PT777423b550828d44bafa3b5e58378aa62a77824898f63c9a', // your signalwire auth token
        spaceUrl: 'assezfacile.signalwire.com', // your signalwire space url
    })
}));

calls.call(new CallOptions({
    xmlFileUrl: 'main-call',
    callerId: '+15812211176', // your signalwire number who show on the call
    callerNumber: '+15812211176', // your signalwire number who make the call
    calleeNumber: '+14182151415' // The number you want to call
})).then(() => {
    console.log('successfully send');
}).catch(() => {
    console.log('error when sending');
});
