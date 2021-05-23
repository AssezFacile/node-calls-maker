# CallsMakerOptions

## Properties:
- customML: Array of [CallsCustomML](./calls-custom-ml.md)
- corsOptions: Object [cors](https://www.npmjs.com/package/cors)

## Callback events
- getAudioPathFile: Should return the path of audio file you want to play
- receivingEvent: Allow you to catch event send by the service you used. And automatically return status 204.
- receivingError: Allow you to catch error send be the service you used. And you could return a [VoiceResponse](./voice-response.md) or nothing.
- receivingCall: Allow you to answer call. Should return a [VoiceResponse](./voice-response.md).