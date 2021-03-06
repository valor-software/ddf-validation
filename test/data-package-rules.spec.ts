import * as chai from 'chai';
import { head, endsWith, isEqual } from 'lodash';
import {
  INCORRECT_FILE,
  DATAPACKAGE_INCORRECT_FIELDS,
  DATAPACKAGE_NON_CONCEPT_FIELD,
  DATAPACKAGE_INCORRECT_PRIMARY_KEY,
  DATAPACKAGE_NON_UNIQUE_RESOURCE_FILE,
  DATAPACKAGE_NON_UNIQUE_RESOURCE_NAME,
  DATA_POINT_WITHOUT_INDICATOR,
  SAME_KEY_VALUE_CONCEPT,
  DATAPACKAGE_NONEXISTENT_RESOURCE,
  DATAPACKAGE_NONEXISTENT_CONCEPT,
  INCONSISTENT_DATAPACKAGE
} from '../src/ddf-rules/registry';
import { DdfDataSet } from '../src/ddf-definitions/ddf-data-set';
import { Issue } from '../src/ddf-rules/issue';
import { allRules } from '../src/ddf-rules';

const expect = chai.expect;

process.env.SILENT_MODE = true;

describe('ddf datapackage.json validation', () => {
  describe('when INCORRECT_FILE', () => {
    it('any issue should NOT be found for folder (fixtures/good-folder-dp)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {
        expect(allRules[INCORRECT_FILE].rule(ddfDataSet).length).to.equal(0);

        done();
      });
    });
    it('one issue should be found for expected folder "fixtures/wrong-file-in-dp"', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/wrong-file-in-dp', null);

      ddfDataSet.load(() => {
        const EXPECTED_INCORRECT_FILE = 'ddf--entities--geo--foo.csv';

        try {
          const results: Array<Issue> = allRules[INCORRECT_FILE].rule(ddfDataSet);

          expect(results.length).to.equal(1);

          const result = head(results);

          expect(result.type).to.equal(INCORRECT_FILE);
          expect(endsWith(result.path, EXPECTED_INCORRECT_FILE)).to.be.true;

          done();
        } catch (e) {
          done(e);
        }
      });
    });

    /*
     it('one issue should be found for expected folder "fixtures/rules-cases/incorrect-file/non-print-chars"', done => {
     const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/incorrect-file/non-print-chars', null);

     ddfDataSet.load(() => {
     const EXPECTED_REASON = 'Non printable characters in filename';
     const EXPECTED_SUGGESTION = 'ddf--entities--region.csv';
     const EXPECTED_INCORRECT_FILE = 'ddf--entities--regi\ron.csv';
     const results: Array<Issue> = allRules[INCORRECT_FILE].rule(ddfDataSet);

     expect(results.length).to.equal(1);

     const result = head(results);

     expect(result.type).to.equal(INCORRECT_FILE);
     expect(endsWith(result.path, EXPECTED_INCORRECT_FILE)).to.be.true;

     const suggestion = head(result.suggestions);

     expect(endsWith(suggestion, EXPECTED_SUGGESTION)).to.be.true;


     expect(result.data.reason).to.equal(EXPECTED_REASON);

     done();
     });
     });
     */
  });

  describe('when DATAPACKAGE_CONFUSED_FIELDS', () => {
    it('any issue should NOT be found for folder (fixtures/good-folder-dp)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {
        expect(allRules[DATAPACKAGE_INCORRECT_FIELDS].rule(ddfDataSet).length).to.equal(0);

        done();
      });
    });

    it('any issue should NOT be found for DS with quoted header (fixtures/rules-cases/dp-quoted-fields)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/dp-quoted-fields', null);

      ddfDataSet.load(() => {
        expect(allRules[DATAPACKAGE_INCORRECT_FIELDS].rule(ddfDataSet).length).to.equal(0);

        done();
      });
    });

    it('any issue should NOT be found for DS with single-field header (fixtures/rules-cases/dp-single-field)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/dp-single-field', null);

      ddfDataSet.load(() => {
        expect(allRules[DATAPACKAGE_INCORRECT_FIELDS].rule(ddfDataSet).length).to.equal(0);

        done();
      });
    });

    it('3 issues should be found for expected folder "fixtures/rules-cases/datapackage-confused-fields"', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/datapackage-confused-fields', null);

      ddfDataSet.load(() => {
        const EXPECTED_ISSUES_QUANTITY = 3;
        const results: Array<Issue> = allRules[DATAPACKAGE_INCORRECT_FIELDS].rule(ddfDataSet);

        expect(results.length).to.equal(EXPECTED_ISSUES_QUANTITY);

        const EXPECTED_DATA = [{
          path: 'datapackage-confused-fields/ddf--concepts.csv',
          data: {
            dataPackageHeaders: ['conceptfoo', 'concept_type', 'name'],
            realHeaders: ['concept', 'concept_type', 'name'],
            headersDifference: ['conceptfoo']
          }
        }, {
          path: 'ddf--datapoints--gas_production_bcf--by--geo--year.csv',
          data: {
            dataPackageHeaders: ['geofoo', 'year', 'gas_production_bcf'],
            realHeaders: ['geo', 'year', 'gas_production_bcf'],
            headersDifference: ['geofoo']
          }
        }, {
          path: 'ddf--entities--geo.csv',
          data: {
            dataPackageHeaders: ['geofoo', 'geo_name'],
            realHeaders: ['geo', 'geo_name'],
            headersDifference: ['geofoo']
          }
        }];

        results.forEach((result, index) => {
          expect(result.type).to.equal(DATAPACKAGE_INCORRECT_FIELDS);
          expect(endsWith(result.path, EXPECTED_DATA[index].path)).to.be.true;
          expect(isEqual(result.data, EXPECTED_DATA[index].data)).to.be.true;
        });

        done();
      });
    });
  });
  describe('when DATAPACKAGE_NON_CONCEPT_FIELD', () => {
    it('any issue should NOT be found for folder (fixtures/good-folder-dp)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {
        expect(allRules[DATAPACKAGE_NON_CONCEPT_FIELD].rule(ddfDataSet).length).to.equal(0);

        done();
      });
    });
    it(`3 issues should be found for expected folder
   "fixtures/rules-cases/datapackage-non-concept-field"`, done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/datapackage-non-concept-field', null);

      ddfDataSet.load(() => {
        const EXPECTED_DATA = [{
          path: 'ddf--concepts.csv',
          data: {nonConcepts: ['conceptfoo']}
        }, {
          path: 'ddf--entities--geo.csv',
          data: {nonConcepts: ['geofoo']}
        }];

        const results: Issue[] = allRules[DATAPACKAGE_NON_CONCEPT_FIELD].rule(ddfDataSet);

        expect(results.length).to.equal(EXPECTED_DATA.length);

        results.forEach((result, index) => {
          expect(result.type).to.equal(DATAPACKAGE_NON_CONCEPT_FIELD);
          expect(endsWith(result.path, EXPECTED_DATA[index].path)).to.be.true;
          expect(isEqual(result.data, EXPECTED_DATA[index].data)).to.be.true;
        });

        done();
      });
    });
  });


  describe('when DATAPACKAGE_NON_UNIQUE_RESOURCE_NAME', () => {
    it('any issue should NOT be found for folder (fixtures/good-folder-dp)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {
        const results: Array<Issue> = allRules[DATAPACKAGE_NON_UNIQUE_RESOURCE_NAME].rule(ddfDataSet);

        expect(results.length).to.equal(0);

        done();
      });
    });
    it('3 issues should be found for expected folder "fixtures/rules-cases/non-unique-resource-name"', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/non-unique-resource-name', null);

      ddfDataSet.load(() => {
        const results: Array<Issue> = allRules[DATAPACKAGE_NON_UNIQUE_RESOURCE_NAME].rule(ddfDataSet);

        expect(results.length).to.equal(1);

        const result = head(results);
        const EXPECTED_DATA = {duplicates: ['ddf--concepts']};

        expect(isEqual(result.data, EXPECTED_DATA)).to.be.true;

        done();
      });
    });
  });
  describe('when DATAPACKAGE_NON_UNIQUE_RESOURCE_FILE', () => {
    it('any issue should NOT be found for folder (fixtures/good-folder-dp)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {
        const results: Array<Issue> = allRules[DATAPACKAGE_NON_UNIQUE_RESOURCE_FILE].rule(ddfDataSet);

        expect(results.length).to.equal(0);

        done();
      });
    });
    it('3 issues should be found for expected folder "fixtures/rules-cases/non-unique-resource-file"', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/non-unique-resource-file', null);

      ddfDataSet.load(() => {
        const results: Array<Issue> = allRules[DATAPACKAGE_NON_UNIQUE_RESOURCE_FILE].rule(ddfDataSet);

        expect(results.length).to.equal(1);

        const result = head(results);
        const EXPECTED_DATA = {duplicates: ['ddf--concepts.csv']};

        expect(isEqual(result.data, EXPECTED_DATA)).to.be.true;

        done();
      });
    });
  });

  describe('when DATA_POINT_WITHOUT_INDICATOR', () => {
    it('any issue should NOT be found for folder (fixtures/good-folder-dp)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {
        const results: Array<Issue> = allRules[DATA_POINT_WITHOUT_INDICATOR].rule(ddfDataSet);

        expect(results.length).to.equal(0);

        done();
      });
    });
    it('one issue should be found for expected folder "fixtures/rules-cases/datapoint-without-indicator"', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/datapoint-without-indicator', null);

      ddfDataSet.load(() => {
        const EXPECTED_FILE = 'ddf--datapoints--foo--by--geo--year.csv';
        const results: Array<Issue> = allRules[DATA_POINT_WITHOUT_INDICATOR].rule(ddfDataSet);

        expect(results.length).to.equal(1);

        const result = head(results);

        expect(result.type).to.equal(DATA_POINT_WITHOUT_INDICATOR);
        expect(result.path).to.equal(EXPECTED_FILE);

        done();
      });
    });
  });


  describe('when DATAPACKAGE_INCORRECT_PRIMARY_KEY', () => {
    it('any issue should NOT be found for folder (fixtures/good-folder-dp)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {

        expect(allRules[DATAPACKAGE_INCORRECT_PRIMARY_KEY].rule(ddfDataSet).length).to.equal(0);

        done();
      });
    });
    it(`3 issues should be found for expected folder
    "fixtures/rules-cases/datapackage-non-concept-incorrect-primary-key"`, done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/datapackage-incorrect-primary-key', null);

      ddfDataSet.load(() => {
        const EXPECTED_DATA = [{
          fields: [
            'concept',
            'concept_type',
            'name'
          ],
          primaryKey: [
            'conceptfoo'
          ],
          reason: 'Primary key is not a part of fields'
        }, {
          fields: [
            'geo',
            'geo_name'
          ],
          primaryKey: [
            'geofoo'
          ],
          reason: 'Primary key is not a part of fields'
        }];

        const results: Issue[] = allRules[DATAPACKAGE_INCORRECT_PRIMARY_KEY].rule(ddfDataSet);

        expect(results.length).to.equal(EXPECTED_DATA.length);

        results.forEach((result, index) => {
          expect(result.type).to.equal(DATAPACKAGE_INCORRECT_PRIMARY_KEY);
          expect(result.data).to.deep.equal(EXPECTED_DATA[index]);
        });

        done();
      });
    });
    it('any issue should NOT be found for folder (fixtures/ddf--gapminder--geo_entity_domain)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/ddf--gapminder--geo_entity_domain', null);

      ddfDataSet.load(() => {
        const results: Issue[] = allRules[DATAPACKAGE_INCORRECT_PRIMARY_KEY].rule(ddfDataSet);

        expect(results.length).to.equal(0);

        done();
      });
    });
    it('some issues should be raised for folder (fixtures/rules-cases/datapackage-incorrect-primary-key-2)', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/datapackage-incorrect-primary-key-2', null);

      ddfDataSet.load(() => {
        const results: Issue[] = allRules[DATAPACKAGE_INCORRECT_PRIMARY_KEY].rule(ddfDataSet);
        const result = head(results);

        expect(results.length).to.equal(1);
        expect(result.data.reason).to.equal('Unclassified primaryKey in ddfSchema');

        done();
      });
    });
  });

  describe('when "SAME_KEY_VALUE_CONCEPT" rule', () => {
    it('any issue should NOT be found for a folder without the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/dummy-companies-with-dp', null);

      ddfDataSet.load(() => {
        const issues = allRules[SAME_KEY_VALUE_CONCEPT].rule(ddfDataSet);

        expect(issues.length).to.equal(0);

        done();
      });
    });

    it('an issue should be found for a folder with the problem', done => {
      const expectedData = {
        schemaRecord: {
          primaryKey: [
            'country'
          ],
          value: 'country',
          resources: [
            'geo--country'
          ]
        },
        reason: 'Value country already exists in primaryKey'
      };
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/same-key-value-concepts', null);

      ddfDataSet.load(() => {
        const issues: Issue[] = allRules[SAME_KEY_VALUE_CONCEPT].rule(ddfDataSet);

        expect(issues.length).to.equal(1);
        expect(isEqual(head(issues).data, expectedData)).to.be.true;

        done();
      });
    });
  });

  describe('when "DATAPACKAGE_NONEXISTENT_RESOURCE" rule', () => {
    it('any issue should NOT be found for a folder without the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/dummy-companies-with-dp', null);

      ddfDataSet.load(() => {
        const issues = allRules[DATAPACKAGE_NONEXISTENT_RESOURCE].rule(ddfDataSet);

        expect(issues.length).to.equal(0);

        done();
      });
    });

    it('an issue should be found for a folder with the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/dp-nonexistent-resource', null);
      const expectedData = [
        {
          nonexistentResources: [
            'company_size_string--by--company--anno-2'
          ],
          record: {
            primaryKey: [
              'anno',
              'company'
            ],
            value: 'company_size_string',
            resources: [
              'company_size_string--by--company--anno-2'
            ]
          },
          specific: 'is NOT found in resources, but found in schema section'
        },
        {
          nonexistentResources: [
            'company_size_string--by--company--anno-2'
          ],
          record: {
            primaryKey: [
              'anno',
              'english_speaking_company'
            ],
            value: 'company_size_string',
            resources: [
              'company_size_string--by--company--anno-2'
            ]
          },
          specific: 'is NOT found in resources, but found in schema section'
        },
        {
          nonexistentResources: [
            'company_size_string--by--company--anno-2'
          ],
          record: {
            primaryKey: [
              'anno',
              'foundation'
            ],
            value: 'company_size_string',
            resources: [
              'company_size_string--by--company--anno-2'
            ]
          },
          specific: 'is NOT found in resources, but found in schema section'
        },
        {
          resource: 'company_size-2',
          specific: 'is NOT found in ddfSchema schema, but found in resources section'
        }
      ];

      ddfDataSet.load(() => {
        const issues: Issue[] = allRules[DATAPACKAGE_NONEXISTENT_RESOURCE].rule(ddfDataSet);

        expect(issues.length).to.equal(expectedData.length);

        issues.forEach((issue, order) => {
          expect(endsWith(issue.path, 'datapackage.json')).to.be.true;
          expect(issue.data).to.deep.equal(expectedData[order]);
        });

        done();
      });
    });
  });

  describe('when "DATAPACKAGE_NONEXISTENT_CONCEPT" rule', () => {
    it('any issue should NOT be found for a folder without the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/dummy-companies-with-dp', null);

      ddfDataSet.load(() => {
        const issues = allRules[DATAPACKAGE_NONEXISTENT_CONCEPT].rule(ddfDataSet);

        expect(issues.length).to.equal(0);

        done();
      });
    });

    it('an issue should be found for a folder with the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/dp-nonexistent-concept', null);

      ddfDataSet.load(() => {
        const issues: Issue[] = allRules[DATAPACKAGE_NONEXISTENT_CONCEPT].rule(ddfDataSet);
        const issue = head(issues);

        expect(issues.length).to.equal(1);
        expect(endsWith(issue.path, 'datapackage.json')).to.be.true;
        expect(issue.data).to.equal('company_size');

        done();
      });
    });
  });

  describe('when "INCONSISTENT_DATAPACKAGE" rule', () => {
    it('any issue should NOT be found for a folder without the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/good-folder-dp', null);

      ddfDataSet.load(() => {
        try {
          const issues = allRules[INCONSISTENT_DATAPACKAGE].rule(ddfDataSet);

          expect(issues.length).to.equal(0);

          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('an issue should be found for a folder with the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/inconsistent-datapackage', null);

      ddfDataSet.load(() => {
        try {
          const expectedIssuesData = [
            [
              {
                source: `Cannot read property 'map' of undefined`,
                reason: 'datapackage.json frictionless validation'
              }
            ],
            [
              `Descriptor validation error:\n        Missing required property: resources\n        at \"\" in descriptor and\n        at \"/required/0\" in profile`
            ],
            {
              reason: 'ddfSchema section is missing or invalid'
            }
          ];
          const issues: Issue[] = allRules[INCONSISTENT_DATAPACKAGE].rule(ddfDataSet);
          const issuesData = issues.map(issue => issue.data);

          expect(issuesData).to.deep.equal(expectedIssuesData);

          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('an issue should be found for a folder with an another kind of the problem', done => {
      const ddfDataSet = new DdfDataSet('./test/fixtures/rules-cases/inconsistent-datapackage-2', null);

      ddfDataSet.load(() => {
        try {
          const expectedIssuesData = [
            {
              reason: 'ddfSchema section is missing or invalid'
            }
          ];

          const issues: Issue[] = allRules[INCONSISTENT_DATAPACKAGE].rule(ddfDataSet);
          const issuesData = issues.map(issue => issue.data);

          expect(issuesData).to.deep.equal(expectedIssuesData);

          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
