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

    say = (content) => {
        this.dom._content.push({
            _name: 'Say',
            _content: content,
        });
    }

    pause = (time) => {
        this.dom._content.push({
            _name: 'Pause',
            _content: time,
        });
    }

    play = (url) => {
        this.dom._content.push({
            _name: 'Play',
            _content: url,
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