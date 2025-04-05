const sinon = require('sinon');

const vscode = {
  window: {
    showErrorMessage: sinon.stub(),
    showQuickPick: sinon.stub(),
    activeTextEditor: {
      selection: { start: { line: 0, character: 0 } },
      document: {
        getText: sinon.stub().returns('selectedText'),
        uri: { fsPath: '/path/to/file.js' },
        getWordRangeAtPosition: sinon.stub().returns({ start: { line: 0, character: 0 }, end: { line: 0, character: 4 } }),
      }
    }
  },
  commands: {
    registerCommand: sinon.stub(),
  },
  workspace: {
    rootPath: '/workspace/root',
    openTextDocument: sinon.stub().resolves({}),
    showTextDocument: sinon.stub().resolves(),
  },
  Range: sinon.stub(),
  Position: sinon.stub(),
};

module.exports = vscode; 