import 'dotenv/config';
import { ethers } from 'ethers';

const CONTRACT_ABI = [
    "function anchorAudit(bytes32 _rootHash, string memory _metadata) public",
    "function verifyAnchor(uint256 _id) public view returns (bytes32, uint256, string memory)",
    "function anchorCount() public view returns (uint256)",
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_CONTRACT || "";
const RPC_URL = process.env.AMOY_RPC_URL || "";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const balanceBefore = await provider.getBalance(wallet.address);
    console.log(`Balance BEFORE: ${ethers.formatEther(balanceBefore)} MATIC`);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // Create a test hash
    const testHash = ethers.keccak256(ethers.toUtf8Bytes("REAL_TEST_" + Date.now()));

    console.log("Sending REAL transaction with optimized gas...");
    const tx = await contract.anchorAudit(testHash, "Real Test Anchor", {
        gasLimit: 120000,
        maxFeePerGas: ethers.parseUnits("30", "gwei"),
        maxPriorityFeePerGas: ethers.parseUnits("25", "gwei"),
    });

    console.log(`TX Hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log(`✅ CONFIRMED in block ${receipt.blockNumber}`);
    console.log(`TX: https://amoy.polygonscan.com/tx/${receipt.hash}`);

    const balanceAfter = await provider.getBalance(wallet.address);
    console.log(`Balance AFTER: ${ethers.formatEther(balanceAfter)} MATIC`);

    const cost = balanceBefore - balanceAfter;
    console.log(`TX Cost: ${ethers.formatEther(cost)} MATIC`);

    const remaining = Number(ethers.formatEther(balanceAfter));
    const costNum = Number(ethers.formatEther(cost));
    console.log(`Remaining TXs possible: ~${Math.floor(remaining / costNum)}`);

    // Verify it's actually on chain
    const count = await contract.anchorCount();
    console.log(`Total anchors on contract: ${count}`);

    const [rootHash, timestamp, metadata] = await contract.verifyAnchor(Number(count) - 1);
    console.log(`\nVERIFICATION FROM CHAIN:`);
    console.log(`  Root Hash: ${rootHash}`);
    console.log(`  Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
    console.log(`  Metadata:  ${metadata}`);
}

main().catch(console.error);
