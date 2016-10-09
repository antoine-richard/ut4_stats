var Promise = require('bluebird');
var _ = require('lodash');

const KILL_REGEX_GLOBAL = /Kill:.+?:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/g;
const KILL_REGEX_SINGLE = /Kill:.+?:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/;

const LINE_SEPARATOR = '\n';
const CSV_HEADER = 'killer,victim,weapon' + LINE_SEPARATOR;

const FORMATTERS = {
    CSV: csvFormat,
    JSON: identity
}

/**
 * Formats the data with the provided format if no
 * formatter is defined then it falls back to the CSV one.
 */
function parse(data, formatter) {
    if (!formatter) {
        formatter = FORMATTERS.CSV;
    }

    var jsonKills = _(data.match(KILL_REGEX_GLOBAL))
        .map(match => KILL_REGEX_SINGLE.exec(match))
        .map(oneKill => getJsonRepresentation(oneKill[1], oneKill[2], oneKill[3]))
        .value();

    return Promise.resolve(formatter(jsonKills));
}

function getJsonRepresentation(killer, victim, weapon) {
    return {
        killer: killer,
        victim: victim,
        weapon: weapon
    };
}

function getCsvRepresentation(oneKill) {
    return oneKill.killer + ',' + oneKill.victim + ',' + oneKill.weapon;
}

function csvFormat(jsonKills) {
    let result = CSV_HEADER;

    _.forEach(jsonKills, oneKill => result += getCsvRepresentation(oneKill) + LINE_SEPARATOR);

    return result;
}

function identity(data) {
    return data;
}

module.exports = {
    parse: parse,
    FORMATTERS: FORMATTERS
};