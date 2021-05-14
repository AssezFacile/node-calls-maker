const { toXML } = require('jstoxml');

class GenericMl {
    dom = {
        _name: 'Response',
        _content: [],
    };
    options = {
        header: true
    };

    constructor() { }

    say = (options, content) => {
        if (typeof(options) === 'string') {
            content = options;
            options = {};
        }

        this.dom._content.push({
            _name: 'Say',
            _content: content,
        });
    }

    pause = (options, time) => {
        if (typeof(options) === 'string') {
            time = options;
            options = {};
        }

        this.dom._content.push({
            _name: 'Pause',
            _content: time,
        });
    }

    play = (options, url) => {
        if (typeof(options) === 'string') {
            url = options;
            options = {};
        }

        this.dom._content.push({
            _name: 'Play',
            _content: url,
        });
    }

    redirect= (options, url) => {
        if (typeof(options) === 'string') {
            url = options;
            options = {};
        }

        this.dom._content.push({
            _name: 'Redirect',
            _content: url
        });
    }

    hangup = () => {
        this.dom._content.push({
            _name: 'Hangup',
        });
    }

    toString = () => {
        return toXML(this.dom);
    }
}

module.exports = GenericMl;