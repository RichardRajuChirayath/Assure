import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Prometheus-compatible metrics endpoint.
 * Exposes key application metrics in the OpenMetrics text format.
 */
export async function GET() {
    const [blocked, allowed, overridden, totalAudit, totalWorkflows] = await Promise.all([
        db.riskEvent.count({ where: { verdict: "BLOCKED" } }),
        db.riskEvent.count({ where: { verdict: "ALLOWED" } }),
        db.riskEvent.count({ where: { verdict: "OVERRIDDEN" } }),
        db.auditLog.count(),
        db.workflow.count({ where: { status: "ACTIVE" } }),
    ]);

    // Average risk score
    const recentEvents = await db.riskEvent.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        select: { riskScore: true },
    });
    const avgScore = recentEvents.length > 0
        ? recentEvents.reduce((a, b) => a + b.riskScore, 0) / recentEvents.length
        : 0;

    const anchored = await db.auditLog.count({ where: { blockchainHash: { not: null } } });

    const metrics = `# HELP assure_risk_events_total Total risk events by verdict
# TYPE assure_risk_events_total counter
assure_risk_events_total{verdict="blocked"} ${blocked}
assure_risk_events_total{verdict="allowed"} ${allowed}
assure_risk_events_total{verdict="overridden"} ${overridden}

# HELP assure_risk_score_avg Average risk score of last 50 events
# TYPE assure_risk_score_avg gauge
assure_risk_score_avg ${avgScore.toFixed(2)}

# HELP assure_audit_logs_total Total audit log entries
# TYPE assure_audit_logs_total counter
assure_audit_logs_total ${totalAudit}

# HELP assure_audit_anchored_total Blockchain-anchored audit entries
# TYPE assure_audit_anchored_total counter
assure_audit_anchored_total ${anchored}

# HELP assure_workflows_active Currently active workflows
# TYPE assure_workflows_active gauge
assure_workflows_active ${totalWorkflows}

# HELP assure_uptime_seconds Application uptime in seconds
# TYPE assure_uptime_seconds gauge
assure_uptime_seconds ${Math.floor(process.uptime())}
`;

    return new Response(metrics, {
        headers: { "Content-Type": "text/plain; version=0.0.4; charset=utf-8" },
    });
}
