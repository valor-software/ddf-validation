import * as chai from 'chai';
import { head } from 'lodash';
import { exec } from 'child_process';

const expect = chai.expect;

function execute(command, callback){
  exec(command, function(error, stdout, stderr) {
    callback(error, stdout, stderr);
  });
}

describe('e2e', () => {
  it('an issue should be found when "ws" flag is ON and DS contains WS based issue', done => {
    execute('./src/cli.js ./test/fixtures/rules-cases/entity-value-as-entity-name --silent --ws', (error, stdout, stderr) => {
      expect(!!error).to.be.true;
      expect(error.code).to.be.equal(1);
      expect(!!stdout).to.be.true;

      const issues = JSON.parse(stdout);
      const issue: {id: string} = <{id: string}>head(issues);

      expect(issues.length).to.be.equals(1);
      expect(issue.id).to.be.equals('ENTITY_VALUE_AS_ENTITY_NAME');
      expect(!!stderr).to.be.false;

      done();
    });
  });

  it('any issue should NOT be found when "ws" flag is OFF and DS contains WS based issue', done => {
    execute('./src/cli.js ./test/fixtures/rules-cases/entity-value-as-entity-name --silent', (error, stdout, stderr) => {
      expect(!!error).to.be.false;
      expect(!!stdout).to.be.false;
      expect(!!stderr).to.be.false;

      done();
    });
  });
});