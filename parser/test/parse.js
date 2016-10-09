var parser = require('../parse');
var chai = require('chai');
chai.use(require('chai-string'));
var expect = chai.expect;

describe('parse', function () {

  it('should output CSV headers', function () {
    let result = parser.parse("6:10 Kill: 4 1 30: JonathanMcCow killed Cyp' by UT_MOD_AK103").value();
    expect(result).to.startsWith("killer,victim,weapon");
  });

  it('should extracts killer, victim and weapon', function () {
    let result = parser.parse("6:10 Kill: 4 1 30: JonathanMcCow killed Cyp' by UT_MOD_AK103").value();
    expect(result).to.have.entriesCount("JonathanMcCow,Cyp',UT_MOD_AK103", 1);
  });

  it('should generate an array with kills', () => {
    let result = parser.parse("6:10 Kill: 4 1 30: JonathanMcCow killed Cyp' by UT_MOD_AK103", parser.FORMATTERS.JSON).value();

    expect(result).to.deep.equal([{
      killer: 'JonathanMcCow',
      victim: 'Cyp\'',
      weapon: 'UT_MOD_AK103'
    }]);

  });

});