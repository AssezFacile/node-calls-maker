const { assert } = require('chai');
const GenericMl = require('../library/modules/provider/generic-ml');

describe('provider generic-ml', () => {
    describe('when add a tag "say"', () => {
        it('with no options, toString should return a XML with empty tag "say"', () => {
            const ml = new GenericMl();
            ml.say();

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Say/></Response>`);
        });

        it('with text as first parameter, toString should return a XML with the text inside the tag "say"', () => {
            const aText = 'some text';
            const ml = new GenericMl();

            ml.say(aText);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Say>${aText}</Say></Response>`);
        });

        it('with object options and text, toString should return a XML with attribute on tag "say"', () => {
            const aText = 'some text';
            const aVoice = 'fr-CA';
            const someOptions = { voice: aVoice };
            const ml = new GenericMl();

            ml.say(someOptions, aText);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="${aVoice}">${aText}</Say></Response>`);
        });
    });

    describe('when add a tag "pause"', () => {
        it('with no options, toString should return a XML with empty tag "pause"', () => {
            const ml = new GenericMl();
            ml.pause();

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Pause/></Response>`);
        });

        it('with string/number as first parameter, toString should return a XML with the attribute length on tag "pause"', () => {
            const aTime = 2;
            const ml = new GenericMl();

            ml.pause(aTime);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Pause length="${aTime}"/></Response>`);
        });

        it('with object options, toString should return a XML with attribute on tag "pause"', () => {
            const aTime = 2;
            const someOptions = { length: aTime };
            const ml = new GenericMl();

            ml.pause(someOptions);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Pause length="${aTime}"/></Response>`);
        });
    });

    describe('when add a tag "play"', () => {
        it('with no options, toString should return a XML with empty tag "play"', () => {
            const ml = new GenericMl();
            ml.play();

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Play/></Response>`);
        });

        it('with string as first parameter, toString should return a XML with the string inside tag "play"', () => {
            const aUrl = 'aUrl';
            const ml = new GenericMl();

            ml.play(aUrl);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Play>${aUrl}</Play></Response>`);
        });

        it('with object options, toString should return a XML with attribute on tag "pause"', () => {
            const aUrl = 'aUrl';
            const aNumberOfLoop = 2;
            const someOptions = { loop: aNumberOfLoop };
            const ml = new GenericMl();

            ml.play(someOptions, aUrl);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Play loop="${aNumberOfLoop}">${aUrl}</Play></Response>`);
        });
    });

    describe('when add a tag "redirect"', () => {
        it('with no options, toString should return a XML with empty tag "redirect"', () => {
            const ml = new GenericMl();
            ml.redirect();

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Redirect/></Response>`);
        });

        it('with string as first parameter, toString should return a XML with the string inside tag "redirect"', () => {
            const aUrl = 'aUrl';
            const ml = new GenericMl();

            ml.redirect(aUrl);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Redirect>${aUrl}</Redirect></Response>`);
        });

        it('with object options, toString should return a XML with attribute on tag "redirect"', () => {
            const aUrl = 'aUrl';
            const aMethod = 'POST';
            const someOptions = { method: aMethod };
            const ml = new GenericMl();

            ml.redirect(someOptions, aUrl);

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Redirect method="${aMethod}">${aUrl}</Redirect></Response>`);
        });
    });

    describe('when add a tag "hangup"', () => {
        it('toString should return a XML with empty tag "hangup"', () => {
            const ml = new GenericMl();
            ml.hangup();

            assert.strictEqual(ml.toString(), `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
        });
    });
});
