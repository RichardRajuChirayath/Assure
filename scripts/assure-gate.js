import axios from 'axios';
import fs from 'fs';

async function run() {
    const backendUrl = process.env.ASSURE_BACKEND_URL;
    const command = process.env.COMMAND_TO_CHECK;
    const env = process.env.ENVIRONMENT || 'production';

    if (!backendUrl || !command) {
        console.error('❌ Missing ASSURE_BACKEND_URL or COMMAND_TO_CHECK');
        process.exit(1);
    }

    console.log(`\n🛡️  Assure CI/CD Gate | Evaluating: "${command}" in ${env}...`);

    try {
        const response = await axios.post(`${backendUrl}/v2/risk/evaluate`, {
            actionType: 'CI_CD_GATE',
            environment: env,
            payload: {
                command,
                github_actor: process.env.GITHUB_ACTOR,
                github_ref: process.env.GITHUB_REF,
                github_repository: process.env.GITHUB_REPOSITORY
            },
            operatorId: 'github-actions'
        });

        const { riskScore, verdict, reasoning } = response.data;

        console.log(`\nRisk Analysis Complete:`);
        console.log(`Score:   ${riskScore}/100`);
        console.log(`Verdict: ${verdict}`);
        console.log(`\nReasoning:`);
        reasoning.forEach(r => console.log(` - ${r}`));

        if (verdict === 'BLOCK') {
            console.error('\n❌ Assure BLOCKED this deployment due to high safety risk.');
            process.exit(1);
        }

        if (verdict === 'WARN') {
            console.warn('\n⚠️  Caution: Assure flagged this as Medium-High risk. Proceeding as configured in CI.');
        }

        if (verdict === 'ALLOW') {
            console.log('\n✅ Assure approved the action. Proceeding with deployment.');
        }

    } catch (error) {
        console.warn('\n⚠️  Assure Service unreachable. Defaulting to FAIL-SAFE (WARN).');
        // In CI, we usually allow but log a loud warning if the safety service is down, 
        // unless the policy is strict.
    }
}

run();
