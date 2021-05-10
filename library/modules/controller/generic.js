const fs = require('fs');
const path = require('path');

exports.getRoot = (req, res) => {
    return res.send('Calls Maker API');
};


exports.getAudio = (getAudioPathFile) => {
    return (req, res) => {
        const pathFile = getAudioPathFile(req.params);
        const extension = path.extname(pathFile);
        const allowed = ['.mp3', '.wav', '.aif'];

        if (!pathFile) {
            return res.status(400).send('No file provided');
        } else if (!fs.existsSync(pathFile)) {
            return res.sendStatus(404);
        } else if (!allowed.includes(extension)) {
            return res.status(404).send();
        }

        const readStream = fs.createReadStream(pathFile);
        if (extension === '.mp3') {
            res.setHeader('content-type', 'audio/mpeg');
        } else {
            res.setHeader('content-type', `audio/${extension.replace('.', '')}`);
        }

        readStream.pipe(res);
    };
};
