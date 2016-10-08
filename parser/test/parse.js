var parse = require('../parse');
var chai = require('chai');
chai.use(require('chai-string'));
var expect = chai.expect;

describe('parse', function() {

  it('should output CSV headers', function() {
    let result = parse("6:10 Kill: 4 1 30: JonathanMcCow killed Cyp' by UT_MOD_AK103").value();
    expect(result).to.startsWith("killer,victim,weapon");
  });

  it('should extracts killer, victim and weapon', function() {
    let result = parse("6:10 Kill: 4 1 30: JonathanMcCow killed Cyp' by UT_MOD_AK103").value();
    expect(result).to.have.entriesCount("JonathanMcCow,Cyp',UT_MOD_AK103", 1);
  });

});