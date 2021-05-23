# @assezfacile/calls-marker
NodeJS library to help to create call with [SignalWire](https://signalwire.com/) and/or [Twilio](https://www.twilio.com/). The library create automatically all the routing for your API.

### Install
`npm install @assezfacile/calls-maker`

### How to use it with expressjs
```
const { client, call, CallsMakerOptions, ServicesOptions, CallOptions } = require('@assezfacile/calls-maker');
const options = new CallsMakerOptions({});
const app = express();

app.use('/calls-maker', expressJs.getRouter(options));
client.initialize(new ServicesOptions({}));
call.create(new CallOptions({}));
```
Here are detailed [example](./example/README.md)

### Docs
- [CallsMakerOptions](./docs/calls-maker-options.md)
- [CallsCustomML](./docs/calls-custom-ml.md)
- [ServicesOptions](./docs/services-options.md)
- [VoiceResponse](./docs/voice-response.md)
