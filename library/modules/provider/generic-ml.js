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
            _content: content || '',
            _attrs: options
        });
    }

    pause = (options) => {
        if (typeof(options) === 'string' || typeof(options) === 'number') {
            options = { length: options };
        }

        this.dom._content.push({
            _name: 'Pause',
            _content: '',
            _attrs: options
        });
    }

    play = (options, url) => {
        if (typeof(options) === 'string') {
            url = options;
            options = {};
        }

        this.dom._content.push({
            _name: 'Play',
            _content: url || '',
            _attrs: options
        });
    }

    redirect= (options, url) => {
        if (typeof(options) === 'string') {
            url = options;
            options = {};
        }

        this.dom._content.push({
            _name: 'Redirect',
            _content: url,
            _attrs: options
        });
    }

    hangup = () => {
        this.dom._content.push({
            _name: 'Hangup',
        });
    }

    toString = () => {
        return toXML(this.dom, this.options);
    }
}

module.exports = GenericMl;