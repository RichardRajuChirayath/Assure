import { ethers } from 'ethers';

// Generate a brand new wallet
const wallet = ethers.Wallet.createRandom();
console.log("=== NEW WALLET (use this on the Polygon faucet) ===");
console.log(`Address:     ${wallet.address}`);
console.log(`Private Key: ${wallet.privateKey}`);
console.log("");
console.log("STEPS:");
console.log("1. Go to https://faucet.polygon.technology/");
console.log("2. Select: Polygon Amoy → POL");
console.log(`3. Paste this address: ${wallet.address}`);
console.log("4. Claim tokens");
console.log(`5. Then update your .env BLOCKCHAIN_PRIVATE_KEY to: ${wallet.privateKey.slice(2)}`);
