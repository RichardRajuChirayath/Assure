import { anchorAuditLogs } from './src/lib/actions';

(async () => {
    try {
        console.log("Anchoring...");
        const res = await anchorAuditLogs();
        console.log("Result:", res);
    } catch (e) {
        console.error("Error:", e);
    }
})();
