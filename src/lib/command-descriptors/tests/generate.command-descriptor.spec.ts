import * as sinon from 'sinon';
import {Command} from '../../../common/program/interfaces/command.interface';
import {Program} from '../../../common/program/interfaces/program.interface';
import {GenerateCommandDescriptor} from '../generate.command-descriptor';
import {GenerateCommandHandler} from '../../handlers/generate-command.handler';
import {CaporalProgram} from '../../../core/program/caporal/caporal.program';
import {CommandDescriptor} from '../../../common/program/interfaces/command.descriptor.interface';
import {CommandHandler} from '../../../common/program/interfaces/command.handler.interface';

describe('GenerateCommandDescriptor', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  let command: Command;
  beforeEach(() => {
    const program: Program = new CaporalProgram();
    command = program.command('name', 'description');
  });

  describe('#declare()', () => {
    let aliasStub: sinon.SinonStub;
    let argumentStub: sinon.SinonStub;
    let optionStub: sinon.SinonStub;
    let handlerStub: sinon.SinonStub;
    beforeEach(() => {
      aliasStub = sandbox.stub(command, 'alias').callsFake(() => command);
      argumentStub = sandbox.stub(command, 'argument').callsFake(() => command);
      optionStub = sandbox.stub(command, 'option').callsFake(() => command);
      handlerStub = sandbox.stub(command, 'handler').callsFake(() => command);
    });

    let handler: CommandHandler;
    beforeEach(() => {
      handler = new GenerateCommandHandler();
      const descriptor: CommandDescriptor = new GenerateCommandDescriptor(handler);
      descriptor.describe(command);
    });

    it('should declare the command alias g', () => {
      sinon.assert.calledWith(aliasStub, 'g');
    });

    it('should declare the mandatory asset argument with the right description', () => {
      sinon.assert.calledWith(argumentStub, '<assetType>', 'The generated asset type');
    });

    it('should declare the mandatory name argument with the right description', () => {
      sinon.assert.calledWith(argumentStub, '<assetName>', 'The generated asset name');
    });

    it('should declare the optional moduleName argument with the right description', () => {
      sinon.assert.calledWith(argumentStub, '[moduleName]', 'The module name where the asset will be declared in');
    });

    it('should call handler() with the GenerateCommandHandler', () => {
      sinon.assert.calledWith(handlerStub, handler);
    });
  });
});
