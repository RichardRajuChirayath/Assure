import 'dotenv/config.js';
import { anchorHashOnChain, hashAuditBatch } from './src/lib/blockchain.js';

(async () => {
    try {
        console.log("Testing anchoring...");
        const hash = hashAuditBatch([{ id: "1", event: "TEST", createdAt: new Date().toISOString() }]);
        const res = await anchorHashOnChain(hash, "Test Metadata");
        console.log("Result:", res);
    } catch (e) {
        console.error("Error:", e);
    }
})();
