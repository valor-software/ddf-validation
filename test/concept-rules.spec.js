'use strict';
const _ = require('lodash');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const DdfDataSet = require('../lib/ddf-definitions/ddf-data-set');
const rulesRegistry = require('../lib/ddf-rules/registry');
const conceptRules = require('../lib/ddf-rules/concept-rules');

chai.use(sinonChai);

describe('rules for concept', () => {
  let ddfDataSet = null;

  describe('when "CONCEPT_ID_IS_NOT_UNIQUE" rule', () => {
    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('any issue should NOT be found for folder without the problem (fixtures/good-folder)', done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/good-folder');
      ddfDataSet.load(() => {
        expect(conceptRules[rulesRegistry.CONCEPT_ID_IS_NOT_UNIQUE](ddfDataSet)).to.be.null;

        done();
      });
    });

    it(`issues should be found for folder with the problem
    (fixtures/rules-cases/concept-is-not-unique)`, done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/concept-is-not-unique');
      ddfDataSet.load(() => {
        const result = conceptRules[rulesRegistry.CONCEPT_ID_IS_NOT_UNIQUE](ddfDataSet);

        expect(result).to.be.not.null;
        expect(result.type).to.equal(rulesRegistry.CONCEPT_ID_IS_NOT_UNIQUE);
        expect(result.data.indexOf('geo')).to.be.greaterThan(-1);
        expect(result.data.indexOf('country')).to.be.greaterThan(-1);

        done();
      });
    });
  });

  describe('when "EMPTY_CONCEPT_ID" rule', () => {
    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('any issue should NOT be found for folder without the problem (fixtures/good-folder)', done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/good-folder');
      ddfDataSet.load(() => {
        expect(conceptRules[rulesRegistry.EMPTY_CONCEPT_ID](ddfDataSet).length).to.equal(0);

        done();
      });
    });

    it(`issues should be found for folder with the problem
    (fixtures/rules-cases/empty-concept-id)`, done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/empty-concept-id');
      ddfDataSet.load(() => {
        const EXPECTED_CSV_LINE = 2;
        const results = conceptRules[rulesRegistry.EMPTY_CONCEPT_ID](ddfDataSet);
        const result = _.head(results);

        expect(results).to.be.not.null;
        expect(results.length).to.equal(1);
        expect(result.type).to.equal(rulesRegistry.EMPTY_CONCEPT_ID);
        expect(result.data.line).to.equal(EXPECTED_CSV_LINE);

        done();
      });
    });
  });

  describe('when "NON_CONCEPT_HEADER" rule', () => {
    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('any issue should NOT be found for folder without the problem (fixtures/good-folder)', done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/good-folder');
      ddfDataSet.load(() => {
        expect(conceptRules[rulesRegistry.NON_CONCEPT_HEADER](ddfDataSet).length).to.equal(0);

        done();
      });
    });

    it(`issues should be found for folder with the problem
    (fixtures/rules-cases/non-concept-header)`, done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/non-concept-header');
      ddfDataSet.load(() => {
        const result = conceptRules[rulesRegistry.NON_CONCEPT_HEADER](ddfDataSet);
        const issuesData = [
          {
            wrongHeaderDetail: 'wrong-header-1',
            suggestions: []
          },
          {
            wrongHeaderDetail: 'xgeo',
            suggestions: ['geo']
          },
          {
            wrongHeaderDetail: 'domain',
            suggestions: []
          },
          {
            wrongHeaderDetail: 'domain',
            suggestions: []
          }
        ];

        expect(result).to.be.not.null;

        issuesData.forEach((issueData, index) => {
          expect(result[index].type).to.equal(rulesRegistry.NON_CONCEPT_HEADER);
          expect(!!result[index].data).to.be.true;
          expect(result[index].data).to.equal(issueData.wrongHeaderDetail);
          expect(_.head(result[index].suggestions)).to.equal(_.head(issueData.suggestions));
        });

        done();
      });
    });
  });

  describe('when "CONCEPT_MANDATORY_FIELD_NOT_FOUND" rule', () => {
    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('any issue should NOT be found for folder without the problem (fixtures/good-folder)', done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/good-folder');
      ddfDataSet.load(() => {
        expect(conceptRules[rulesRegistry.CONCEPT_MANDATORY_FIELD_NOT_FOUND](ddfDataSet).length).to.equal(0);

        done();
      });
    });

    it(`issues should be found for folder with the problem
    (fixtures/rules-cases/concept-mandatory-field-not-found)`, done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/concept-mandatory-field-not-found');
      ddfDataSet.load(() => {
        const result = conceptRules[rulesRegistry.CONCEPT_MANDATORY_FIELD_NOT_FOUND](ddfDataSet);
        const issuesData = [
          {
            line: 1,
            field: 'concept_type',
            value: true

          },
          {
            line: 3,
            field: 'domain',
            value: true
          },
          {
            line: 4,
            field: 'domain',
            value: false
          }
        ];

        expect(result).to.be.not.null;
        expect(result.length).to.equal(issuesData.length);

        issuesData.forEach((issueData, index) => {
          expect(result[index].type).to.equal(rulesRegistry.CONCEPT_MANDATORY_FIELD_NOT_FOUND);
          expect(!!result[index].data).to.be.true;
          expect(result[index].data.line).to.equal(issueData.line);
          expect(result[index].data.field).to.equal(issueData.field);
          expect(!!result[index].data.value).to.equal(issueData.value);
        });

        done();
      });
    });
  });

  describe('when "CONCEPTS_NOT_FOUND" rule', () => {
    afterEach(done => {
      ddfDataSet.dismiss(() => {
        done();
      });
    });

    it('any issue should NOT be found for folder without the problem (fixtures/good-folder)', done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/good-folder');
      ddfDataSet.load(() => {
        const result = conceptRules[rulesRegistry.CONCEPTS_NOT_FOUND](ddfDataSet);

        expect(result).to.be.null;

        done();
      });
    });

    it(`issues should be found for folder with the problem
    (fixtures/rules-cases/concepts-not-found)`, done => {
      ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/concepts-not-found');
      ddfDataSet.load(() => {
        const result = conceptRules[rulesRegistry.CONCEPTS_NOT_FOUND](ddfDataSet);

        expect(result).to.be.not.null;
        expect(result.type).to.equal(rulesRegistry.CONCEPTS_NOT_FOUND);

        done();
      });
    });
  });
});
