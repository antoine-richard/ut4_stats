var parser = require('./parse');
var Promise = require('bluebird');

var readFile = Promise.promisify(require('fs').readFile);
var request = Promise.promisify(require('request'));

let args = process.argv.slice(2);

if (args.length < 1) {
    throw new Error('Usage: node index.js path_to_log_file');
}

let serverHost = args.length == 2 ? args[1] : 'localhost';
console.log(`Selected backend: ${serverHost}`);

readFile(args[0], 'utf8')
    .then(data => parser.parse(data, parser.FORMATTERS.JSON))
    .then(jsonKills => httpPost(`http://${serverHost}/api/kills`, jsonKills))
    .then((response, body) => {
        if (response.statusCode === 201) {
            console.log('Data persisted successfully');
        } else {
            console.log(`Unexpected status code ${response.statusCode}`);
        }
    })
    .catch(error => console.log(error));

function httpPost(url, data) {
    var options = {
        uri: url,
        method: 'POST',
        json: data
    };

    return request(options);
}
