#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import axios from 'axios';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

program
    .name('assure')
    .description('Assure — Pre-execution safety layer CLI')
    .version('2.0.0');

program
    .command('preflight')
    .description('Intercept and evaluate the risk of a command before execution')
    .argument('<command...>', 'The command to execute')
    .option('-e, --env <environment>', 'Environment context (production, staging, dev)', 'production')
    .action(async (commandArgs, options) => {
        const fullCommand = commandArgs.join(' ');
        console.log(chalk.bold.magenta('\n🛡️  Assure | Preflight Check Initiated...'));
        console.log(chalk.gray(`Target Action: ${chalk.white(fullCommand)}`));
        console.log(chalk.gray(`Environment:   ${chalk.cyan(options.env.toUpperCase())}\n`));

        try {
            // 1. Evaluate Risk
            const backendUrl = process.env.ASSURE_BACKEND_URL || 'http://localhost:3001';

            const response = await axios.post(`${backendUrl}/v2/risk/evaluate`, {
                actionType: 'CLI_COMMAND',
                environment: options.env,
                payload: { command: fullCommand, args: commandArgs },
                operatorId: process.env.USER || 'local-operator'
            });

            const { riskScore, verdict, reasoning } = response.data;

            // 2. Handle Verdict
            console.log(chalk.bold('Analysis Result:'));
            console.log(`Risk Score: ${getScoreColor(riskScore)(riskScore + '/100')}`);
            console.log(`Verdict:    ${getVerdictColor(verdict)(verdict)}`);
            console.log(`\nReasoning:`);
            reasoning.forEach(r => console.log(` - ${r}`));
            console.log('');

            if (verdict === 'BLOCK') {
                console.log(chalk.bgRed.white.bold(' ❌ ACTION BLOCKED '));
                console.log(chalk.red('The risk level exceeds your security threshold for this environment.'));
                process.exit(1);
            }

            if (verdict === 'WARN') {
                const { confirm } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: chalk.yellow('This action is flagged as high risk. Do you wish to proceed anyway? (This will be logged)'),
                        default: false
                    }
                ]);

                if (!confirm) {
                    console.log(chalk.gray('Action cancelled by operator.'));
                    process.exit(0);
                }

                console.log(chalk.yellow('Override confirmed. Proceeding with caution...\n'));
            }

            if (verdict === 'ALLOW') {
                console.log(chalk.green('✅ Safety check passed. Executing...\n'));
            }

            // 3. Execute
            execSync(fullCommand, { stdio: 'inherit' });

        } catch (error) {
            if (error.response) {
                // Handle Warp specific fail-safes defined in backend
                const { verdict, reasoning } = error.response.data;
                if (verdict === 'WARN') {
                    console.log(chalk.yellow('⚠️  Assure Service Warning:', reasoning[0]));
                    // For demo, allow proceed in fail-safe
                    execSync(fullCommand, { stdio: 'inherit' });
                    return;
                }
            }

            console.error(chalk.red('Error connecting to Assure Backend. Check connectivity.'));
            process.exit(1);
        }
    });

function getScoreColor(score) {
    if (score < 40) return chalk.green;
    if (score < 75) return chalk.yellow;
    return chalk.red;
}

function getVerdictColor(verdict) {
    if (verdict === 'ALLOW') return chalk.green;
    if (verdict === 'WARN') return chalk.yellow;
    return chalk.red;
}

program.parse();
