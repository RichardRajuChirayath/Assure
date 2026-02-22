# Assure VS Code Extension

Real-time safety intelligence for your DevOps workflows. Get early feedback on risky changes, infrastructure deletes, and production bypasses directly in your editor.

## Features

- **Preflight Safety Check**: Run a deep forensic analysis on your active file content.
- **Neural Intent Analysis**: Detects risky patterns like `rm -rf`, `drop table`, and `--force`.
- **Environment Awareness**: Automatically identifies production configuration files.
- **Explainable Verdicts**: Get clear reasoning for every Safe/Warn/Block decision.
- **Dashboard Integration**: One-click jump to the Assure browser dashboard for deep forensics.

## Configuration

Go to VS Code Settings and search for `Assure`:
- `assure.apiUrl`: Base URL of your Assure backend (default: `http://localhost:3001`).
- `assure.apiKey`: Your platform API key.

## Setup & Development

1. **Install Dependencies**:
   ```bash
   cd vscode-extension
   npm install
   ```

2. **Compile**:
   ```bash
   npm run compile
   ```

3. **Launch**:
   - Open this folder in VS Code.
   - Press `F5` to open a new Extension Development Host window.
   - Open a risky file (e.g., `prod.config.yaml` with a `force: true` flag).
   - Run command: `Assure: Preflight Safety Check` from the Command Palette (`Cmd+Shift+P`).

## Packaging for Demo

To create a `.vsix` file for manual installation:
1. Install `vsce`: `npm install -g @vscode/vsce`
2. Run: `vsce package`
3. Install in VS Code: `Extensions: Install from VSIX...`

---
*Assure — Prevent, don't just detect.*
