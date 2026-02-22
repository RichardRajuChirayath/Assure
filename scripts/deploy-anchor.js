const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {
    const RPC_URL = process.env.AMOY_RPC_URL;
    const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;

    if (!RPC_URL || !PRIVATE_KEY) {
        console.error("Please set AMOY_RPC_URL and BLOCKCHAIN_PRIVATE_KEY in your .env file");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("Deploying AssureAuditAnchor with account:", wallet.address);

    // This is a simplified deployment for demo purposes using the compiled bytecode
    // In a full Hardhat setup, this would be more robust.
    // For this environment, we'll suggest using Remix or a simple script if they have solc.

    console.log("\n--- DEPLOYMENT STEPS ---");
    console.log("1. Go to https://remix.ethereum.org");
    console.log("2. Create a new file 'AuditAnchor.sol' and paste the contract code.");
    console.log("3. Compile (Ctrl+S) using version 0.8.19.");
    console.log("4. Go to 'Deploy & Run Transactions' tab.");
    console.log("5. Set Environment to 'Injected Provider' (Connect Metamask).");
    console.log("6. Ensure Metamask is on 'Polygon Amoy Testnet'.");
    console.log("7. Click 'Deploy'.");
    console.log("8. Copy the Contract Address and paste it into your .env file as NEXT_PUBLIC_AUDIT_CONTRACT.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
