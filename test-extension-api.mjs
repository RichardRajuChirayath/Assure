import axios from 'axios';

async function testExtensionApi() {
    console.log("Testing Assure Extension API Endpoint...");
    try {
        const response = await axios.post('http://localhost:3001/v2/risk/evaluate', {
            actionType: "VSCODE_EDIT:typescript",
            environment: "PRODUCTION",
            operatorId: "vscode-test-agent",
            payload: {
                fileName: "/prod/deploy.ts",
                languageId: "typescript",
                hasForce: true,
                hasDrop: true,
                contentSnippet: "async function wipe() { await shell.exec(\"rm -rf /data --force\"); }"
            }
        });

        console.log("API Status:", response.status);
        console.log("Verdict:", response.data.verdict);
        console.log("Risk Score:", response.data.riskScore);
        console.log("Reasoning:", response.data.reasoning);
    } catch (error) {
        console.error("API Call Failed:", error.response?.data || error.message);
    }
}

testExtensionApi();
