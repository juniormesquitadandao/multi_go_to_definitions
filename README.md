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

## Development

```sh
cd multi_go_to_definitions
  ARG_USER_UID=$(id -u) ARG_USER_GID=$(id -g) docker compose config
  ARG_USER_UID=$(id -u) ARG_USER_GID=$(id -g) docker compose build
  docker compose up -d
  docker compose exec app bash
    npm install
    npm test
    exit
  docker compose down
```

## License
MIT License 