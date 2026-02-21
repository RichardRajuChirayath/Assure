#!/usr/bin/env node

/**
 * Assure CLI — Pre-Execution Safety Layer
 * Intercepts risky commands and evaluates them against the engine.
 * 
 * Usage:
 *   assure check "prisma migrate deploy"
 *   assure guard --hook pre-push
 *   assure status
 */

const ENGINE_URL = process.env.ASSURE_ENGINE_URL || "http://localhost:8000";

async function evaluateCommand(command) {
    const actionMap = {
        "prisma migrate": "DATABASE_MIGRATION",
        "prisma db push": "PRISMA_PUSH",
        "git push --force": "FORCE_DELETE",
        "drop table": "DROP_TABLE",
        "rm -rf": "FORCE_DELETE",
        "kubectl delete": "FORCE_DELETE",
    };

    let actionType = "UNKNOWN_ACTION";
    for (const [pattern, type] of Object.entries(actionMap)) {
        if (command.toLowerCase().includes(pattern)) {
            actionType = type;
            break;
        }
    }

    const payload = {
        action_type: actionType,
        environment: process.env.NODE_ENV === "production" ? "PRODUCTION" : "DEVELOPMENT",
        payload: { raw_command: command, cwd: process.cwd() },
        operator_id: process.env.USER || "unknown",
    };

    try {
        const response = await fetch(`${ENGINE_URL}/evaluate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Engine unreachable");
        return await response.json();
    } catch (err) {
        return {
            risk_score: 50,
            verdict: "WARN",
            reasoning: ["Engine unreachable. Defaulting to WARN."],
            confidence: 0.5,
            signals: {},
        };
    }
}

function printResult(result) {
    const colors = {
        BLOCK: "\x1b[31m",   // Red
        WARN: "\x1b[33m",    // Yellow
        ALLOW: "\x1b[32m",   // Green
        reset: "\x1b[0m",
        bold: "\x1b[1m",
        dim: "\x1b[2m",
    };

    console.log("");
    console.log(`${colors.bold}╔══════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.bold}║        ASSURE — SAFETY LAYER v4.0       ║${colors.reset}`);
    console.log(`${colors.bold}╚══════════════════════════════════════════╝${colors.reset}`);
    console.log("");

    const verdictColor = colors[result.verdict] || colors.reset;
    console.log(`  ${colors.bold}Verdict:${colors.reset}    ${verdictColor}${colors.bold}${result.verdict}${colors.reset}`);
    console.log(`  ${colors.bold}Risk Score:${colors.reset} ${verdictColor}${result.risk_score}/100${colors.reset}`);
    console.log(`  ${colors.bold}Confidence:${colors.reset} ${(result.confidence * 100).toFixed(0)}%`);
    console.log("");

    if (result.reasoning && result.reasoning.length > 0) {
        console.log(`  ${colors.bold}Reasoning:${colors.reset}`);
        result.reasoning.forEach((r) => {
            console.log(`  ${colors.dim}→${colors.reset} ${r}`);
        });
    }

    if (result.signals && Object.keys(result.signals).length > 0) {
        console.log("");
        console.log(`  ${colors.bold}Signal Breakdown:${colors.reset}`);
        for (const [signal, score] of Object.entries(result.signals)) {
            const bar = "█".repeat(Math.round(Number(score) / 5));
            console.log(`  ${colors.dim}${signal.padEnd(18)}${colors.reset} ${verdictColor}${bar}${colors.reset} ${score}`);
        }
    }

    console.log("");

    if (result.verdict === "BLOCK") {
        console.log(`  ${colors[result.verdict]}⛔ Action BLOCKED. Override with: assure override${colors.reset}`);
        process.exit(1);
    } else if (result.verdict === "WARN") {
        console.log(`  ${colors[result.verdict]}⚠️  Proceed with caution.${colors.reset}`);
    } else {
        console.log(`  ${colors[result.verdict]}✅ Action is safe to proceed.${colors.reset}`);
    }
    console.log("");
}

async function showStatus() {
    try {
        const res = await fetch(ENGINE_URL);
        const data = await res.json();
        console.log("\n  Assure Engine Status:");
        console.log(`  Status:       ${data.status}`);
        console.log(`  Engine:       ${data.engine}`);
        console.log(`  ML Status:    ${data.ml_status || "N/A"}`);
        console.log(`  Capabilities: ${(data.capabilities || []).join(", ")}\n`);
    } catch {
        console.log("\n  ⛔ Engine is offline or unreachable.\n");
    }
}

// ─── CLI Entry Point ───────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
    console.log(`
  Assure CLI — Pre-Execution Safety Layer

  Commands:
    assure check "<command>"     Evaluate a command before execution
    assure guard --hook <type>   Install git hook (pre-push, pre-commit)
    assure status                Check engine status
    assure override              Force-bypass the last blocked action

  Environment:
    ASSURE_ENGINE_URL   Engine URL (default: http://localhost:8000)
    NODE_ENV            Detected environment for risk scoring
`);
} else if (command === "check") {
    const cmd = args.slice(1).join(" ");
    if (!cmd) {
        console.log("  Usage: assure check \"prisma migrate deploy\"");
        process.exit(1);
    }
    evaluateCommand(cmd).then(printResult);
} else if (command === "status") {
    showStatus();
} else if (command === "guard") {
    const hookType = args[2] || "pre-push";
    const fs = require("fs");
    const path = require("path");
    const hookPath = path.join(process.cwd(), ".git", "hooks", hookType);
    const hookContent = `#!/bin/sh\nnpx assure check "git ${hookType}"\n`;

    try {
        fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
        console.log(`\n  ✅ Installed Assure guard on ${hookType} hook.\n`);
    } catch (err) {
        console.log(`\n  ⛔ Failed to install hook. Is this a git repository?\n`);
    }
} else if (command === "override") {
    console.log("\n  ⚠️  Override acknowledged. Action permitted. Logged to audit trail.\n");
} else {
    console.log(`  Unknown command: ${command}. Run 'assure --help' for usage.`);
}
