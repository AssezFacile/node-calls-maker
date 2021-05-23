// Uncomment to test the local library
const { expressJs, ml, client, call, CallsMakerOptions, CallsCustomML, ServicesOptions, SignalwireOptions, TwilioOptions, CallOptions } = require('../index');
// Uncomment to test the repository library
//const { expressJs, ml, client, call, CallsMakerOptions, CallsCustomML, ServicesOptions, SignalwireOptions, TwilioOptions, CallOptions } = require('@assezfacile/calls-maker');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

const options = new CallsMakerOptions({
    getAudioPathFile: async (query, params, body) => {
        return `${__dirname}/audio.mp3`;
    },
    receivingEvent: async (query, params, body) => {
        console.log('receiving event', params, body);
    },
    receivingError: async (query, params, body) => {
        console.log('receiving error', params, body);
    },
    receivingCall: async (query, params, body) => {
        const response = new ml.VoiceResponse;

        response.say('Hi world! thanks for calling');
        response.pause(2);
        response.redirect(`incoming-call/redirect-call-to`);

        return response;
    },
    customML: [
        new CallsCustomML({
            url: 'main-call',
            action: async (query, params, body) => {
                const response = new ml.VoiceResponse;

                response.say('Hello world!');
                response.pause(2);
                response.redirect(`${params.id}/redirect-call-to`);

                return response;
            }
        }),
        new CallsCustomML({
            url: 'redirect-call-to',
            action: async (query, params, body) => {
                const response = new ml.VoiceResponse;

                response.play(`${HOST}${BASIC_URL_FOR_CALLSMAKER}/audio/-specific-id-/audio.mp3`);
                response.hangup();

                return response;
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

/* Get information of one call *//*
call.getInfo('b1816381-7a1a-445c-8740-9690d6d79886').then(data => console.log(data));
call.getInfo('CAbb857318fb62dd9091fd0a36c50f8e8a').then(data => console.log(data));
*/

/* Generate a new call *//*
call.create(new CallOptions({
    xmlFileUrl: 'main-call',
    calleeNumber: NUMBER_TO_CALL,
})).then((result) => {
    console.log('successfully send', result);
}).catch((error) => {
    console.log('error when sending', error);
});
*/

call.getServiceOptions().then(options => console.log(options));