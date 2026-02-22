import { getAuditLogs, getRecentRiskEvents } from "@/lib/actions";
import { AuditClient } from "@/components/audit-client";

export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
    const [auditLogs, riskEvents] = await Promise.all([
        getAuditLogs(),
        getRecentRiskEvents()
    ]);

    return <AuditClient auditLogs={auditLogs} riskEvents={riskEvents} />;
}
