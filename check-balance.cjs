const { ethers } = require('ethers');
require('dotenv').config();

const RPC_URL = "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;

async function main() {
    if (!PRIVATE_KEY) {
        console.log("No Private Key found in .env");
        return;
    }
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log(`Address: ${wallet.address}`);
    const balance = await provider.getBalance(wallet.address);
    console.log(`Balance: ${ethers.formatEther(balance)} MATIC`);

    const feeData = await provider.getFeeData();
    console.log(`Gas Price: ${ethers.formatUnits(feeData.gasPrice, 'gwei')} gwei`);
}

main();
