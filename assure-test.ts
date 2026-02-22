// ASSURE SAFETY LAYER TEST
// This file contains a risky command to trigger the Preflight Safety Check.

console.log("Preparing to execute high-risk maintenance...");

// Trigger Command:
// In reality, this would be a destructive command that Assure would intercept.
const dangerousCommand = "rm -rf /production-data --force";

async function executeMaintenance() {
    console.log("Attempting command: " + dangerousCommand);
    // If you run 'Assure: Preflight Safety Check' on this file,
    // the extension will catch the 'rm -rf' and '--force' patterns!
}

executeMaintenance();
