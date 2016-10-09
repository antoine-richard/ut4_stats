var parser = require('./parse');
var Promise = require('bluebird');
var fs = require('fs');

var mkdir = Promise.promisify(fs.mkdir);
var writeFile = Promise.promisify(fs.writeFile);
var readFile = Promise.promisify(fs.readFile);

let args = process.argv.slice(2);

if (args.length !== 2) {
    throw new Error('Usage: node index.js path_to_log_file path_to_csv_result');
}

mkdirIfRequired('out')
    .then(() => readFile(args[0], 'utf8'))
    .then(data => parser.parse(data))
    .then(csvContent => writeFile('out/' + args[1], csvContent, 'utf8'));

function mkdirIfRequired(path) {
    return mkdir(path)
        .catch(error => {
            // If the folder already exists don't break the promise
            if (error.code !== 'EEXIST') {
                throw error;
            }
        })
}