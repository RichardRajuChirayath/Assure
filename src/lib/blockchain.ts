import { ethers } from "ethers";

// Minimal ABI — just the anchor + verify functions
const CONTRACT_ABI = [
    "function anchorAudit(bytes32 _rootHash, string memory _metadata) public",
    "function verifyAnchor(uint256 _id) public view returns (bytes32, uint256, string memory)",
    "function anchorCount() public view returns (uint256)",
    "event AuditAnchored(uint256 indexed id, bytes32 indexed rootHash, uint256 timestamp)"
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AUDIT_CONTRACT || "";
const RPC_URL = process.env.AMOY_RPC_URL || "";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";

/**
 * Hashes a batch of audit log entries into a single Merkle-like root.
 * Uses keccak256 to produce a tamper-evident fingerprint.
 */
export function hashAuditBatch(logs: { id: string; event: string; createdAt: string }[]): string {
    const concatenated = logs.map(l => `${l.id}:${l.event}:${l.createdAt}`).join("|");
    return ethers.keccak256(ethers.toUtf8Bytes(concatenated));
}

/**
 * Anchors a hash to the blockchain (Polygon Amoy testnet).
 * Returns the transaction hash on success, or null if config is missing.
 */
export async function anchorHashOnChain(rootHash: string, metadata: string): Promise<string | null> {
    if (!CONTRACT_ADDRESS || !RPC_URL || !PRIVATE_KEY) {
        console.warn("[Integrity] Blockchain credentials not configured. Skipping anchor.");
        return null;
    }

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

        const tx = await contract.anchorAudit(rootHash, metadata);
        const receipt = await tx.wait();

        console.log(`[Integrity] Audit anchored. TX: ${receipt.hash}`);
        return receipt.hash;
    } catch (error) {
        console.error("[Integrity] Blockchain anchoring failed:", error);
        return null;
    }
}

/**
 * Verifies an anchor on-chain by its ID.
 */
export async function verifyAnchorOnChain(anchorId: number): Promise<{
    rootHash: string;
    timestamp: number;
    metadata: string;
} | null> {
    if (!CONTRACT_ADDRESS || !RPC_URL) return null;

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const [rootHash, timestamp, metadata] = await contract.verifyAnchor(anchorId);
        return {
            rootHash,
            timestamp: Number(timestamp),
            metadata,
        };
    } catch (error) {
        console.error("[Integrity] Verification failed:", error);
        return null;
    }
}
