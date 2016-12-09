import * as chai from 'chai';
import {DDFRoot} from '../src/data/ddf-root';

const FOLDERS_ARE_ABSENT = 0;
const AT_LEAST_ONE_FOLDER_SHOULD_EXIST = 1;

const expect = chai.expect;

describe('ddf root folder validation', () => {
  describe('when non DDF folder', () => {
    const ddfRoot = new DDFRoot('./test/fixtures/bad-folder', null);

    it('ddf folders should not be defined', done => {
      ddfRoot.check(() => {
        expect(ddfRoot.getDirectoriesDescriptors().length).to.equal(FOLDERS_ARE_ABSENT);
        done();
      });
    });
  });

  describe('when DDF folder (fixtures/good-folder)', () => {
    it('count of ddf folders should be 1', done => {
      const ddfRoot = new DDFRoot('./test/fixtures/good-folder', null);

      ddfRoot.check(() => {
        expect(ddfRoot.getDirectoriesDescriptors().length).to.equal(AT_LEAST_ONE_FOLDER_SHOULD_EXIST);
        done();
      });
    });
  });

  describe('when good folder with sub-folders (fixtures/good-folder-with-subfolders)', () => {
    it('count of ddf folders should be greater than 1', done => {
      const ddfRoot = new DDFRoot('./test/fixtures/good-folder-with-subfolders', {multiDirMode: true});

      ddfRoot.check(() => {
        expect(ddfRoot.getDirectoriesDescriptors().length).to.be.greaterThan(AT_LEAST_ONE_FOLDER_SHOULD_EXIST);
        done();
      });
    });
  });
});