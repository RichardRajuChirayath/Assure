# Assure: Pre-Execution Safety Layer 🛡️

**Assure** is an intelligent security layer designed to stop catastrophic DevOps accidents before they happen. It integrates directly into VS Code to analyze code snippets, terminal commands, and configuration changes for high-risk patterns.

## 🚀 How it Works

Assure uses a multi-model intelligence engine hosted on the cloud to evaluate every execution request. 

1. **Context Extraction**: The extension analyzes your active file for risky patterns (e.g., `rm -rf`, `drop table`, `--force`).
2. **AI Risk Assessment**: Data is sent to the Assure Engine (running Llama-powered heuristics) to calculate a real-time risk score.
3. **Verdict Enforcement**:
   - **🟢 ALLOW**: Safe to proceed.
   - **🟡 WARN**: Potential risk detected, proceed with caution.
   - **🔴 BLOCK**: High-risk pattern detected. Execution is discouraged until reviewed.
4. **Forensic Audit**: Every check is logged in a central dashboard and Batch-Anchored to the **Polygon Blockchain** for immutable proof of compliance.

## 🔧 Installation & Setup

1. **Install** from the VS Code Marketplace.
2. **Open any file** containing deployment or maintenance commands.
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`) and run **"Assure: Preflight Safety Check"**.
4. View the forensic report directly in your IDE.

## 🏢 Governance Dashboard

All safety events captured by this extension are synced to the **Assure Terminal**, allowing SRE teams to monitor cross-org safety health and recurring failure patterns.

- **URL**: [Assure Terminal](https://assure-production.up.railway.app/dashboard)
- **Forensics**: Immutable logs verified via Polygon (Amoy Testnet).

---
*Built for the future of Safe DevOps.*

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
