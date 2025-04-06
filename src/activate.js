function activate(context, _vscode, _child_process) {
  const vscode = _vscode || require('vscode');
  const { exec, execSync } = _child_process || require('child_process');

  let disposable = vscode.commands.registerCommand('extension.multiGoToDefinitions', () => {

    try {
      execSync('rg --version', { stdio: 'ignore' });
    } catch (err) {
      const instruction = {
        linux: 'sudo apt install ripgrep',
        darwin: 'brew install ripgrep',
        win32: 'choco install ripgrep'
      }[process.platform] || '';

      vscode.window.showErrorMessage(`Please install Ripgrep: ${instruction}`);

      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.commands.executeCommand('actions.find');
      return;
    }

    const selection = editor.selection;
    let selectedText = editor.document.getText(selection);

    if (!selectedText) {
      const wordRange = editor.document.getWordRangeAtPosition(selection.start);
      selectedText = editor.document.getText(wordRange);
    }

    if (!selectedText) {
      vscode.commands.executeCommand('actions.find');
      return;
    }

    const currentFilePath = editor.document.uri.fsPath;
    const currentLineNumber = selection.start.line + 1;

    const command = `rg --sort=path -n --max-count=100 "${selectedText}" ${vscode.workspace.rootPath} || true`;
    exec(command, { cwd: vscode.workspace.rootPath, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 }, (err, stdout) => {
      try {
        if (err) {
          vscode.window.showErrorMessage(`Error: ${err}`);
          return;
        }

        const definitions = stdout.split('\n').filter(definition => definition);
        if (definitions.length === 0) {
          vscode.commands.executeCommand('actions.find');
          return;
        }

        const items = definitions.map(definition => {
          const [absolutePath, line, ...code] = definition.split(':');

          return {
            label: absolutePath === currentFilePath ? '' : absolutePath.replace(`${vscode.workspace.rootPath}/`, ''),
            description: `:${line} ${code[0].trim()}`,
            absolutePath: absolutePath,
            line: parseInt(line),
            selection: new vscode.Range(
              new vscode.Position(parseInt(line) - 1, 0),
              new vscode.Position(parseInt(line) - 1, 0)
            )
          }
        }).filter(item => item.absolutePath !== currentFilePath || item.line !== currentLineNumber)
          .sort((a, b) => {
            if (a.absolutePath === currentFilePath && b.absolutePath !== currentFilePath) {
              return -1;
            }
            if (a.absolutePath !== currentFilePath && b.absolutePath === currentFilePath) {
              return 1;
            }
            return 0;
          });

        vscode.window.showQuickPick(items, {
          placeHolder: `Definitions of ${selectedText}`
        }).then(item => {
          if (item) {
            vscode.workspace.openTextDocument(item.absolutePath).then(document => {
              vscode.window.showTextDocument(document, {
                selection: item.selection
              });
            });
          }
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
      }
    });
  });

  context.subscriptions.push(disposable);
}

module.exports = activate; 