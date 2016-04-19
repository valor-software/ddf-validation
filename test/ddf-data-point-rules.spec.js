'use strict';
const _ = require('lodash');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const DdfData = require('../lib/ddf-definitions/ddf-data');
const rulesRegistry = require('../lib/ddf-rules/registry');
const dataPointsRules = require('../lib/ddf-rules/data-point-rules');
const expect = chai.expect;

chai.use(sinonChai);
describe('rules for data points', () => {
  let ddfData = null;

  describe('when data set is correct (\'fixtures/good-folder\')', () => {
    ddfData = new DdfData('./test/fixtures/good-folder');

    Object.getOwnPropertySymbols(dataPointsRules).forEach(dataPointRuleKey => {
      it(`any issue should NOT be found for rule ${Symbol.keyFor(dataPointRuleKey)}`, done => {
        ddfData.load(() => {
          const expectedDataPointDetail = ddfData.getDataPoint().details[0];

          ddfData.getDataPoint().loadDetail(expectedDataPointDetail, () => {
            expect(dataPointsRules[dataPointRuleKey](ddfData, expectedDataPointDetail).length).to.equal(0);

            done();
          });
        });
      });
    });
  });

  describe('when data set is NOT correct', () => {
    afterEach(done => {
      ddfData.dismiss(() => {
        done();
      });
    });

    it(`an issue should be found for rule 'DATA_POINT_VALUE_NOT_NUMERIC'
   (fixtures/rules-cases/data-point-value-not-num)`, done => {
      ddfData = new DdfData('./test/fixtures/rules-cases/data-point-value-not-num');
      ddfData.load(() => {
        const dataPointValueNotNumRule = dataPointsRules[rulesRegistry.DATA_POINT_VALUE_NOT_NUMERIC];
        const expectedDataPointDetail = ddfData.getDataPoint().details[0];
        const expectedFileName = 'ddf--datapoints--pop--by--country--year.csv';
        const expectedMeasure = 'pop';
        const expectedLine = 2;
        const expectedValue = 'huge';

        ddfData.getDataPoint().loadDetail(expectedDataPointDetail, () => {
          const issues = dataPointValueNotNumRule(ddfData, expectedDataPointDetail);
          const issue = _.head(issues);

          expect(issues.length).to.equal(1);
          expect(issue.type).to.equal(rulesRegistry.DATA_POINT_VALUE_NOT_NUMERIC);
          expect(issue.path.endsWith(expectedFileName)).to.be.true;
          expect(!!issue.data).to.be.true;
          expect(issue.data.measure).to.equal(expectedMeasure);
          expect(issue.data.line).to.equal(expectedLine);
          expect(issue.data.value).to.equal(expectedValue);

          done();
        });
      });
    });

    it(`an issue should be found for rule 'DATA_POINT_UNEXPECTED_ENTITY_VALUE'
   (fixtures/rules-cases/data-point-unexpected-entity-value)`, done => {
      ddfData = new DdfData('./test/fixtures/rules-cases/data-point-unexpected-entity-value');
      ddfData.load(() => {
        const dataPointUnexpectedConceptRule =
          dataPointsRules[rulesRegistry.DATA_POINT_UNEXPECTED_ENTITY_VALUE];
        const expectedDataPointDetail = ddfData.getDataPoint().details[0];
        const expectedFileName = 'ddf--datapoints--pop--by--country--year.csv';
        const expectedConcept = 'country';
        const expectedLine = 2;
        const expectedValue = 'non-usa';

        ddfData.getDataPoint().loadDetail(expectedDataPointDetail, () => {
          const issues = dataPointUnexpectedConceptRule(ddfData, expectedDataPointDetail);
          const issue = _.head(issues);

          expect(issues.length).to.equal(1);
          expect(issue.type).to.equal(rulesRegistry.DATA_POINT_UNEXPECTED_ENTITY_VALUE);
          expect(issue.path.endsWith(expectedFileName)).to.be.true;
          expect(!!issue.data).to.be.true;
          expect(issue.data.concept).to.equal(expectedConcept);
          expect(issue.data.line).to.equal(expectedLine);
          expect(issue.data.value).to.equal(expectedValue);

          done();
        });
      });
    });

    it(`an issue should be found for rule 'DATA_POINT_UNEXPECTED_TIME_VALUE'
   (fixtures/rules-cases/data-point-unexpected-time-value)`, done => {
      ddfData = new DdfData('./test/fixtures/rules-cases/data-point-unexpected-time-value');
      ddfData.load(() => {
        const dataPointUnexpectedTimeRule =
          dataPointsRules[rulesRegistry.DATA_POINT_UNEXPECTED_TIME_VALUE];
        const expectedDataPointDetail = ddfData.getDataPoint().details[0];
        const expectedFileName = 'ddf--datapoints--pop--by--country--year.csv';
        const expectedConcept = 'year';
        const expectedLine = 2;
        const expectedValue = '1960wfoo';

        ddfData.getDataPoint().loadDetail(expectedDataPointDetail, () => {
          const issues = dataPointUnexpectedTimeRule(ddfData, expectedDataPointDetail);
          const issue = _.head(issues);

          expect(issues.length).to.equal(1);
          expect(issue.type).to.equal(rulesRegistry.DATA_POINT_UNEXPECTED_TIME_VALUE);
          expect(issue.path.endsWith(expectedFileName)).to.be.true;
          expect(!!issue.data).to.be.true;
          expect(issue.data.concept).to.equal(expectedConcept);
          expect(issue.data.line).to.equal(expectedLine);
          expect(issue.data.value).to.equal(expectedValue);

          done();
        });
      });
    });
  });
});