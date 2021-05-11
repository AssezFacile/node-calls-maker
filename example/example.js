// Uncomment to test the local library
//const { expressJs, ml, calls, CallsMakerOptions, CallsCustomML, ServicesOptions, SignalwireOptions, TwilioOptions, CallOptions } = require('../index');
// Uncomment to test the repository library
const { expressJs, ml, calls, CallsMakerOptions, CallsCustomML, ServicesOptions, SignalwireOptions, TwilioOptions, CallOptions } = require('@assezfacile/calls-maker');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const HOST = `http://209.171.160.246:${PORT}`;
const BASIC_URL_FOR_CALLSMAKER = '/calls-maker';
const SIGNALWIRE_ACCOUNTSID = ''; // your signalwire project sid
const SIGNALWIRE_AUTHTOKEN = ''; // your signalwire auth token
const SIGNALWIRE_SPACEURL = ''; // your signalwire space url
const SIGNALWIRE_CALLER_NUMBER = ''; // your signalwire number
const TWILIO_ACCOUNTSID = ''; // your signalwire project sid
const TWILIO_AUTHTOKEN = ''; // your signalwire auth token
const TWILIO_CALLER_NUMBER = ''; // your signalwire number
const NUMBER_TO_CALL = ''; // number to call

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

calls.initialize(new ServicesOptions({
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

calls.call(new CallOptions({
    xmlFileUrl: 'main-call',
    calleeNumber: NUMBER_TO_CALL,
})).then((result) => {
    console.log('successfully send', result);
}).catch((error) => {
    console.log('error when sending', error);
});
