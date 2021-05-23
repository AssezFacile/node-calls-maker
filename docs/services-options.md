# ServicesOptions

## Properties
- externalUrl: URL for your API
- basicUrl: Path for all request. Default "calls-maker"
- signalwire: SignalwireOptions
- twilio: TwilioOptions


## SignalwireOptions
### Properties
- accountSid
- authToken
- spaceUrl
- callerId: Number who show on call
- numbers: List of numbers use to make the call

## TwilioOptions
### Properties
- accountSid
- authToken
- callerId: Number who show on call
- numbers: List of numbers use to make the call