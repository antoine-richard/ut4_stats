var Promise = require('bluebird')
var fs = require('fs')

var mkdir = Promise.promisify(fs.mkdir)
var writeFile = Promise.promisify(fs.writeFile)
var readFile = Promise.promisify(fs.readFile)

const KILL_REGEX_GLOBAL = /Kill:.+?:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/g
const KILL_REGEX_SINGLE = /Kill:.+?:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/

let args = process.argv.slice(2);

if (args.length !== 2) {
    throw new Error('Usage: node parser.js path_to_log_file path_to_csv_result')
}

const LINE_SEPARATOR = '\n'
let csvContent='killer,victim,weapon' + LINE_SEPARATOR;

readFile(args[0], 'utf8')
    .then(data => {
        let matches = data.match(KILL_REGEX_GLOBAL)
        let numberOfKills = matches.length;
        let chain = Promise.resolve();

        for (let i = 0; i < matches.length; i++) {
            let oneKill = KILL_REGEX_SINGLE.exec(matches[i])
            let killRepresentation = getKillRepresentation(oneKill[1], oneKill[2], oneKill[3])
            console.log(i + 1 + '/' + numberOfKills + ' - ' + killRepresentation)
            csvContent += killRepresentation + LINE_SEPARATOR
        }
        return mkdir('out')
    })
    .then(() => writeFile('out/' + args[1], csvContent, 'utf8'))

function getKillRepresentation(killer, victim, weapon) {
    return killer + ',' + victim + ',' + weapon;
}
