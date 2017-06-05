import * as sinon from 'sinon';
import * as fs from 'fs';
import {expect} from 'chai';
import {FileSystemUtils} from '../../utils/file-system.utils';
import {Stats} from 'fs';
import * as path from 'path';

describe('FileSystemUtils', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('#stat()', () => {
    const filename: string = 'path/to/filename';

    let statStub: sinon.SinonStub;
    beforeEach(() => {
      statStub = sandbox.stub(fs, 'stat');
    });

    it('should return a Stat of filename', () => {
      statStub.callsFake((filename, callback) => callback(null, {}));
      return FileSystemUtils.stat(filename)
        .then((stat: Stats) => {
          expect(stat).to.not.be.undefined;
        });
    });

    it('should return the error', () => {
      statStub.callsFake((filename, callback) => callback(new Error('stat error'), null));
      return FileSystemUtils.stat(filename)
        .then(() => {
          throw new Error('should not be here');
        })
        .catch(error => {
          expect(error.message).to.be.equal('stat error');
        });
    });
  });

  describe('#mkdir()', () => {
    const target: string = 'path/to/target';

    let statStub: sinon.SinonStub;
    let resolveStub: sinon.SinonStub;
    let mkdirStub: sinon.SinonStub;
    beforeEach(() => {
      statStub = sandbox.stub(FileSystemUtils, 'stat').callsFake(() => Promise.reject('stat error'));
      resolveStub = sandbox.stub(path, 'resolve').callsFake((parent: string, child: string) => parent.concat(path.sep).concat(child));
      mkdirStub = sandbox.stub(fs, 'mkdir').callsFake((directoryName, callback) => callback());
    });

    it('should create recursively the path', () => {
      return FileSystemUtils.mkdir(target)
        .then(() => {
          sinon.assert.callCount(statStub, 3);
          sinon.assert.calledWith(statStub, '/path');
          sinon.assert.calledWith(statStub, '/path/to');
          sinon.assert.calledWith(statStub, '/path/to/target');
          sinon.assert.callCount(mkdirStub, 3);
          sinon.assert.calledWith(mkdirStub, '/path');
          sinon.assert.calledWith(mkdirStub, '/path/to');
          sinon.assert.calledWith(mkdirStub, '/path/to/target');
        });
    });
  });

  describe('#rmdir()', () => {

  });
});