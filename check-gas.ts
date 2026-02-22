import 'dotenv/config';
import { ethers } from 'ethers';

const RPC_URL = process.env.AMOY_RPC_URL || "";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const balance = await provider.getBalance(wallet.address);
    console.log(`Current Balance: ${ethers.formatEther(balance)} MATIC`);

    const feeData = await provider.getFeeData();
    console.log(`Network Gas Price: ${ethers.formatUnits(feeData.gasPrice || 0, "gwei")} gwei`);
    console.log(`Max Fee Per Gas: ${ethers.formatUnits(feeData.maxFeePerGas || 0, "gwei")} gwei`);
    console.log(`Max Priority Fee: ${ethers.formatUnits(feeData.maxPriorityFeePerGas || 0, "gwei")} gwei`);

    // Calculate max affordable TX
    const gasLimit = 100000n;
    const gasPrice = feeData.gasPrice || 0n;
    const txCost = gasLimit * gasPrice;
    console.log(`\nCost of 1 TX (100k gas): ${ethers.formatEther(txCost)} MATIC`);
    console.log(`Can afford: ${Number(balance) / Number(txCost)} TXs`);
}

main().catch(console.error);
