import * as vscode from 'vscode';
import axios from 'axios';

export interface RiskResult {
    riskScore: number;
    verdict: 'ALLOW' | 'WARN' | 'BLOCK';
    reasoning: string[];
    mlConfidence: number;
    isAnomaly: boolean;
    breakdown: any;
    planning?: any;
}

export class AssureService {
    private static getConfiguration() {
        const config = vscode.workspace.getConfiguration('assure');
        return {
            apiUrl: config.get<string>('apiUrl') || 'http://localhost:3001',
            apiKey: config.get<string>('apiKey') || ''
        };
    }

    public static async evaluateRisk(context: any): Promise<RiskResult | null> {
        const { apiUrl, apiKey } = this.getConfiguration();

        try {
            const response = await axios.post(`${apiUrl}/v2/risk/evaluate`, {
                actionType: context.actionType,
                environment: context.environment,
                payload: context.payload,
                operatorId: 'vscode-extension'
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Assure API Error:', error);
            return null;
        }
    }

    public static collectContext(): any {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return null;
        }

        const document = editor.document;
        const text = document.getText();

        // Simple context extraction
        const hasForce = /(--force|-f|force: true)/i.test(text);
        const hasDrop = /(drop|delete|remove|truncate|rm -rf)/i.test(text);
        const isProdConfig = /(prod|production|mainnet)/i.test(document.fileName);

        return {
            actionType: `VSCODE_EDIT:${document.languageId}`,
            environment: isProdConfig ? "PRODUCTION" : "STAGING",
            payload: {
                fileName: document.fileName,
                languageId: document.languageId,
                hasForce,
                hasDrop,
                contentSnippet: text.substring(0, 500) // First 500 chars for context
            }
        };
    }
}
