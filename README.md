# @assezfacile/calls-marker
NodeJS library to help to create call with signalwire and/or twilio. The library create automatically all the routing for expressjs.

### Install
`npm install @assezfacile/calls-maker`

### How to use it
```
const { client, ServicesOptions, CallOptions } = require('@assezfacile/calls-maker');

client.initialize(new ServicesOptions({}));
call.create(new CallOptions({}));
```
more detail in [example](./example/README.md)