const fs = require('node:fs');

const readJson = (path) => {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

const writeJson = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
    readJson,
    writeJson
}