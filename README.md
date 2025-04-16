# Multi Go To Definitions

Navigate and find definitions across multiple languages with ease.

## Features
- Quickly navigate to definitions in various programming languages.
- Use the command `extension.multiGoToDefinitions` to activate.
- Shortcut: `Ctrl+F` when the editor is focused.

## Installation

### From Marketplace
1. Open Visual Studio Code.
2. Go to Extensions view (`Ctrl+Shift+X`).
3. Search for "Multi Go To Definitions".
4. Click 'Install'.

### From VSIX
1. Download the `.vsix` file.
2. Open Visual Studio Code.
3. Go to Extensions view (`Ctrl+Shift+X`).
4. Click on 'Install from VSIX...' and select the downloaded file.

## Usage
- Open a file in the editor.
- Select a word or place the cursor on it.
- Press `Ctrl+F` to find its definition.

## Requirements
- Visual Studio Code version 1.0.0 or higher.
- Ripgrep (rg) must be installed:
  - **Linux**: `sudo apt install ripgrep`
  - **macOS**: `brew install ripgrep`
  - **Windows**: `choco install ripgrep`

## Preferences: Open User Settings (JSON)
```js
{
  "window.commandCenter": 1,
  "workbench.preferredDarkColorTheme": "Default Dark Modern",
  "workbench.colorTheme": "Default Dark Modern",
  "workbench.preferredLightColorTheme": "Default Dark Modern",
  "editor.stickyScroll.enabled": false,
  "editor.stickyScroll.scrollWithEditor": false,
  "workbench.tree.enableStickyScroll": false,
  "editor.fontSize": 12,
  "terminal.integrated.mouseWheelZoom": true,
  "editor.mouseWheelZoom": true,
  "workbench.preferredHighContrastLightColorTheme": "Default Dark Modern",
  "workbench.preferredHighContrastColorTheme": "Default Dark Modern",
  "editor.links": false,
  "editor.tabSize": 2,
  "typescript.preferGoToSourceDefinition": true,
  "javascript.preferGoToSourceDefinition": true,
  "editor.detectIndentation": false,
  "terminal.integrated.fontSize": 13,
  "cursor.composer.shouldAutoScrollToBottom": false,
  "cursor.cmdk.autoSelect": false,
  "cursor.cmdk.useThemedDiffBackground": false,
  "cursor.chat.terminalShowHoverHint": false,
  "files.trimTrailingWhitespace": true,
  "files.trimFinalNewlines": true,
  "workbench.editor.enablePreview": false,
  "diffEditor.useInlineViewWhenSpaceIsLimited": false,
  "explorer.autoReveal": false,
  "workbench.editor.tabSizing": "shrink",
  "workbench.editor.wrapTabs": false,
  "explorer.confirmDragAndDrop": false,
  "explorer.confirmDelete": false
}
```

## Preferences: Open Keyboard Shortcuts (JSON)
```js
[
  {
    "key": "ctrl+i",
    "command": "composerMode.agent"
  },
  {
    "key": "ctrl+y",
    "command": "redo"
  },
  {
    "key": "ctrl+z",
    "command": "-redo"
  },
  {
    "key": "ctrl+=",
    "command": "editor.action.fontZoomIn"
  },
  {
    "key": "ctrl+-",
    "command": "editor.action.fontZoomOut"
  },
  {
    "key": "ctrl+0",
    "command": "editor.action.fontZoomReset"
  },
  {
    "key": "ctrl+shift+j",
    "command": "editor.action.joinLines"
  }
]
```

## Development

```sh
cd multi_go_to_definitions
  ARG_USER_UID=$(id -u) ARG_USER_GID=$(id -g) docker compose config
  ARG_USER_UID=$(id -u) ARG_USER_GID=$(id -g) docker compose build
  docker compose up -d
  docker compose exec app bash
    npm install
    npm test
    npm run build
    exit
  docker compose down
```

## License
MIT License