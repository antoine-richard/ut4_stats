var parse = require('./parse');
var Promise = require('bluebird');
var fs = require('fs');

var mkdir = Promise.promisify(fs.mkdir);
var writeFile = Promise.promisify(fs.writeFile);
var readFile = Promise.promisify(fs.readFile);

let args = process.argv.slice(2);

if (args.length !== 2) {
    throw new Error('Usage: node index.js path_to_log_file path_to_csv_result');
}

mkdir('out')
    .then(() => readFile(args[0], 'utf8'))
    .then(data => parse(data))
    .then(csvContent => writeFile('out/' + args[1], csvContent, 'utf8'));
