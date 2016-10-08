var Promise = require('bluebird')

const KILL_REGEX_GLOBAL = /Kill:.+?:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/g
const KILL_REGEX_SINGLE = /Kill:.+?:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/

const LINE_SEPARATOR = '\n'
let csvHeader='killer,victim,weapon' + LINE_SEPARATOR;

function parse(data) {
    let matches = data.match(KILL_REGEX_GLOBAL)
    let numberOfKills = matches.length;
    let result = csvHeader;

    for (let i = 0; i < matches.length; i++) {
        let oneKill = KILL_REGEX_SINGLE.exec(matches[i])
        let killRepresentation = getKillRepresentation(oneKill[1], oneKill[2], oneKill[3])
        // console.log(i + 1 + '/' + numberOfKills + ' - ' + killRepresentation)
        result += killRepresentation + LINE_SEPARATOR
    }
    return Promise.resolve(result);
}

function getKillRepresentation(killer, victim, weapon) {
    return killer + ',' + victim + ',' + weapon;
}

module.exports = parse;