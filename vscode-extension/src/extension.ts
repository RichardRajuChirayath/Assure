import * as vscode from 'vscode';

import { AssureService } from './assureService';

export function activate(context: vscode.ExtensionContext) {
    console.log('Assure Extension is now active.');

    let disposable = vscode.commands.registerCommand('assure.preflight', async () => {
        const workspaceContext = AssureService.collectContext();

        if (!workspaceContext) {
            vscode.window.showErrorMessage('Assure: No active editor found to analyze.');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Assure: Running Preflight Safety Check...",
            cancellable: false
        }, async (progress) => {
            const result = await AssureService.evaluateRisk(workspaceContext);

            if (!result) {
                vscode.window.showErrorMessage('Assure: Backend unreachable. Check your settings.');
                return;
            }

            const verdictColor = result.verdict === 'BLOCK' ? '🔴' : result.verdict === 'WARN' ? '🟠' : '🟢';
            const message = `${verdictColor} Assure Verdict: ${result.verdict} (Risk: ${result.riskScore}/100)`;

            const detail = result.reasoning.length > 0
                ? `\n\nTop Factors:\n- ${result.reasoning.join('\n- ')}`
                : '';

            const action = await vscode.window.showInformationMessage(
                message + detail,
                { modal: false },
                'View in Dashboard'
            );

            if (action === 'View in Dashboard') {
                vscode.env.openExternal(vscode.Uri.parse('http://localhost:3000/dashboard'));
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
