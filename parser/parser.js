
const KILL_REGEX = /Kill:.+?:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/g;

if (process.argv.length !== 3) {
    throw new Error('Usage: node parser.js path_to_file');
}

require('fs').readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    console.log(data);
});