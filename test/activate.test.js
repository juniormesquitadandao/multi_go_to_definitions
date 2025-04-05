const { expect } = require('chai');
const sinon = require('sinon');
const vscode = require('vscode');
const { execSync } = require('child_process');
const activate = require('../src/activate');

sinon.stub(vscode.commands, 'registerCommand');
sinon.stub(vscode.window, 'showErrorMessage');
sinon.stub(execSync);

describe('Activate Function', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should register the command', () => {
    const context = { subscriptions: [] };
    activate(context);
    expect(vscode.commands.registerCommand.calledWith('extension.multiGoToDefinitions')).to.be.true;
  });

  it('should show the correct error message if ripgrep is not installed', () => {
    execSync.throws(new Error('command not found'));
    const context = { subscriptions: [] };
    activate(context);
    const expectedMessage = `Please install Ripgrep: ${{
      linux: 'sudo apt install ripgrep',
      mac: 'brew install ripgrep',
      windows: 'choco install ripgrep'
    }[process.platform]}`;
    expect(vscode.window.showErrorMessage.calledWith(expectedMessage)).to.be.true;
  });

  it('should show the correct error message for Linux if ripgrep is not installed', () => {
    execSync.throws(new Error('command not found'));
    sinon.stub(process, 'platform').value('linux');
    const context = { subscriptions: [] };
    activate(context);
    const expectedMessage = 'Please install Ripgrep: sudo apt install ripgrep';
    expect(vscode.window.showErrorMessage.calledWith(expectedMessage)).to.be.true;
  });

  it('should show the correct error message for macOS if ripgrep is not installed', () => {
    execSync.throws(new Error('command not found'));
    sinon.stub(process, 'platform').value('darwin');
    const context = { subscriptions: [] };
    activate(context);
    const expectedMessage = 'Please install Ripgrep: brew install ripgrep';
    expect(vscode.window.showErrorMessage.calledWith(expectedMessage)).to.be.true;
  });

  it('should show the correct error message for Windows if ripgrep is not installed', () => {
    execSync.throws(new Error('command not found'));
    sinon.stub(process, 'platform').value('win32');
    const context = { subscriptions: [] };
    activate(context);
    const expectedMessage = 'Please install Ripgrep: choco install ripgrep';
    expect(vscode.window.showErrorMessage.calledWith(expectedMessage)).to.be.true;
  });

  it('should show a generic error message if the platform is unknown and ripgrep is not installed', () => {
    execSync.throws(new Error('command not found'));
    sinon.stub(process, 'platform').value('unknown');
    const context = { subscriptions: [] };
    activate(context);
    const expectedMessage = 'Please install Ripgrep: unknown platform';
    expect(vscode.window.showErrorMessage.calledWith(expectedMessage)).to.be.true;
  });

  it('should return early if there is no active text editor', () => {
    sinon.stub(vscode.window, 'activeTextEditor').value(undefined);
    const context = { subscriptions: [] };
    activate(context);
    expect(vscode.commands.registerCommand.calledWith('extension.multiGoToDefinitions')).to.be.true;
    expect(vscode.window.showErrorMessage.called).to.be.false;
  });

  it('should retrieve the word at the cursor if no text is selected', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns(''),
        getWordRangeAtPosition: sinon.stub().returns({ start: { line: 0, character: 0 }, end: { line: 0, character: 4 } }),
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    const context = { subscriptions: [] };
    activate(context);
    expect(mockEditor.document.getText.calledTwice).to.be.true;
    expect(mockEditor.document.getWordRangeAtPosition.calledOnce).to.be.true;
  });

  it('should return early if no text is selected and no word is found at the cursor', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns(''),
        getWordRangeAtPosition: sinon.stub().returns(null),
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    const context = { subscriptions: [] };
    activate(context);
    expect(mockEditor.document.getText.calledTwice).to.be.true;
    expect(mockEditor.document.getWordRangeAtPosition.calledOnce).to.be.true;
    expect(vscode.window.showErrorMessage.called).to.be.false;
  });

  it('should retrieve the selected text from the editor', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 }, end: { line: 0, character: 4 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    const context = { subscriptions: [] };
    activate(context);
    expect(mockEditor.document.getText.calledOnceWith(mockEditor.selection)).to.be.true;
  });

  it('should return early if no text is selected', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns(''),
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    const context = { subscriptions: [] };
    activate(context);
    expect(mockEditor.document.getText.calledOnceWith(mockEditor.selection)).to.be.true;
    expect(vscode.window.showErrorMessage.called).to.be.false;
  });

  it('should retrieve the current file path and line number from the editor', () => {
    const mockEditor = {
      selection: { start: { line: 5, character: 0 } },
      document: {
        uri: { fsPath: '/path/to/file.js' },
        getText: sinon.stub().returns('selectedText'),
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    const context = { subscriptions: [] };
    activate(context);
    expect(mockEditor.document.uri.fsPath).to.equal('/path/to/file.js');
    expect(mockEditor.selection.start.line + 1).to.equal(6);
  });

  it('should construct the correct command string', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
        uri: { fsPath: '/path/to/file.js' },
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    sinon.stub(vscode.workspace, 'rootPath').value('/workspace/root');
    const context = { subscriptions: [] };
    activate(context);
    const expectedCommand = 'rg --sort=path -n --max-count=100 "selectedText" /workspace/root || true';
    expect(execSync.calledWith(expectedCommand)).to.be.true;
  });

  it('should show an error message if the command execution fails', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
        uri: { fsPath: '/path/to/file.js' },
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    sinon.stub(vscode.workspace, 'rootPath').value('/workspace/root');
    execSync.throws(new Error('command failed'));
    const context = { subscriptions: [] };
    activate(context);
    expect(vscode.window.showErrorMessage.calledWith('Error: command failed')).to.be.true;
  });

  it('should return early if no definitions are found', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
        uri: { fsPath: '/path/to/file.js' },
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    sinon.stub(vscode.workspace, 'rootPath').value('/workspace/root');
    execSync.returns('');
    const context = { subscriptions: [] };
    activate(context);
    expect(vscode.window.showErrorMessage.called).to.be.false;
  });

  it('should map definitions to items with correct properties', () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
        uri: { fsPath: '/path/to/file.js' },
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    sinon.stub(vscode.workspace, 'rootPath').value('/workspace/root');
    execSync.returns('file.js:10:const x = 10;\nfile.js:20:const y = 20;');
    const context = { subscriptions: [] };
    activate(context);
    const expectedItems = [
      {
        label: 'file.js',
        description: ':10 const x = 10;',
        absolutePath: 'file.js',
        line: 10,
        selection: new vscode.Range(new vscode.Position(9, 0), new vscode.Position(9, 0))
      },
      {
        label: 'file.js',
        description: ':20 const y = 20;',
        absolutePath: 'file.js',
        line: 20,
        selection: new vscode.Range(new vscode.Position(19, 0), new vscode.Position(19, 0))
      }
    ];
    const items = activate(context);
    expect(items).to.deep.equal(expectedItems);
  });

  it('should show quick pick and open the document', async () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
        uri: { fsPath: '/path/to/file.js' },
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    sinon.stub(vscode.workspace, 'rootPath').value('/workspace/root');
    execSync.returns('file.js:10:const x = 10;');
    const showQuickPickStub = sinon.stub(vscode.window, 'showQuickPick').resolves({
      absolutePath: 'file.js',
      selection: new vscode.Range(new vscode.Position(9, 0), new vscode.Position(9, 0))
    });
    const openTextDocumentStub = sinon.stub(vscode.workspace, 'openTextDocument').resolves({});
    const showTextDocumentStub = sinon.stub(vscode.window, 'showTextDocument').resolves();
    const context = { subscriptions: [] };
    await activate(context);
    expect(showQuickPickStub.calledOnce).to.be.true;
    expect(openTextDocumentStub.calledOnce).to.be.true;
    expect(showTextDocumentStub.calledOnce).to.be.true;
  });

  it('should show an error message if an error occurs in the promise chain', async () => {
    const mockEditor = {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
        uri: { fsPath: '/path/to/file.js' },
      }
    };
    sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
    sinon.stub(vscode.workspace, 'rootPath').value('/workspace/root');
    execSync.returns('file.js:10:const x = 10;');
    sinon.stub(vscode.window, 'showQuickPick').rejects(new Error('promise error'));
    const context = { subscriptions: [] };
    await activate(context);
    expect(vscode.window.showErrorMessage.calledWith('Error: promise error')).to.be.true;
  });

  it('should add the disposable to the context subscriptions', () => {
    const context = { subscriptions: [] };
    activate(context);
    expect(context.subscriptions.length).to.equal(1);
  });
}); 