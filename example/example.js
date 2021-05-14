// Uncomment to test the local library
//const { expressJs, ml, client, call, CallsMakerOptions, CallsCustomML, ServicesOptions, SignalwireOptions, TwilioOptions, CallOptions } = require('../index');
// Uncomment to test the repository library
const { expressJs, ml, client, call, CallsMakerOptions, CallsCustomML, ServicesOptions, SignalwireOptions, TwilioOptions, CallOptions } = require('@assezfacile/calls-maker');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const HOST = `http://209.171.160.246:${PORT}`;
const BASIC_URL_FOR_CALLSMAKER = '/calls-maker';
const SIGNALWIRE_ACCOUNTSID = 'd1e89cc8-45e7-43d3-a4c5-7376479636b2';
const SIGNALWIRE_AUTHTOKEN = 'PT777423b550828d44bafa3b5e58378aa62a77824898f63c9a';
const SIGNALWIRE_SPACEURL = 'assezfacile.signalwire.com';
const SIGNALWIRE_CALLER_NUMBER = '+15812211176';
const TWILIO_ACCOUNTSID = 'AC2e8115632a73353b09ca7e9ab911f258';
const TWILIO_AUTHTOKEN = '91aac9d089b6377c1cf1c4ee8a697c5a';
const TWILIO_CALLER_NUMBER = '+15817009337';
const NUMBER_TO_CALL = '+14182151415';

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
                const response = new ml.VoiceResponse;

                response.say('Hello world!');
                response.pause(2);
                response.play(`${HOST}${BASIC_URL_FOR_CALLSMAKER}/audio/-specific-id-/audio.mp3`);
                response.hangup();

                return response.toString();
            }
        })
    ],
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(BASIC_URL_FOR_CALLSMAKER, expressJs.getRouter(options));
app.get('/', (req, res) => { res.send('example api!'); });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

client.initialize(new ServicesOptions({
    externalHost: HOST,
    basicUrl: BASIC_URL_FOR_CALLSMAKER,
    signalwire: new SignalwireOptions({
        accountSid: SIGNALWIRE_ACCOUNTSID,
        authToken: SIGNALWIRE_AUTHTOKEN,
        spaceUrl: SIGNALWIRE_SPACEURL,
        numbers: [SIGNALWIRE_CALLER_NUMBER],
    }),
    twilio: new TwilioOptions({
        accountSid: TWILIO_ACCOUNTSID,
        authToken: TWILIO_AUTHTOKEN,
        numbers: [TWILIO_CALLER_NUMBER],
    }),
}));

call.create(new CallOptions({
    xmlFileUrl: 'main-call',
    calleeNumber: NUMBER_TO_CALL,
})).then((result) => {
    console.log('successfully send', result);
}).catch((error) => {
    console.log('error when sending', error);
});
