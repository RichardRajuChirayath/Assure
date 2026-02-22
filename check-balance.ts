import 'dotenv/config.js';
import { ethers } from 'ethers';

const RPC_URL = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";

(async () => {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const balance = await provider.getBalance(wallet.address);
        console.log(`Wallet Address: ${wallet.address}`);
        console.log(`Balance: ${ethers.formatEther(balance)} MATIC`);
    } catch (e) {
        console.error("Error checking balance:", e);
    }
})();
