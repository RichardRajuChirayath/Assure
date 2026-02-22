"use server";

import db, { withRetry } from "./db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// ─── Zod Schemas ───────────────────────────────────────────
const WorkflowSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    type: z.string().min(1, "Type is required"),
    description: z.string().optional(),
});

const RiskEventSchema = z.object({
    actionType: z.string().min(1),
    riskScore: z.number().min(0).max(100),
    verdict: z.enum(["BLOCKED", "ALLOWED", "OVERRIDDEN"]),
    reasoning: z.string(),
    context: z.any(),
});

// ─── Auth Helper ───────────────────────────────────────────
async function getAuthUser() {
    try {
        const clerk = await import("@clerk/nextjs/server");
        const { userId: id } = await auth();
        if (!id) return { userId: null, user: null };

        // Try to find the user in our DB
        let user = await withRetry(() => db.user.findUnique({ where: { clerkId: id } }));

        // If authenticated via Clerk but missing in our DB, auto-create (Bulletproof for demo)
        if (!user) {
            const clerkUser = await clerk.currentUser();
            user = await db.user.create({
                data: {
                    clerkId: id,
                    email: clerkUser?.emailAddresses[0]?.emailAddress || "demo@assure.ai",
                    name: clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}` : "Assure Operator",
                }
            });
        }

        return { userId: id, user };
    } catch (e) {
        console.error("Auth helper error:", e);
        return { userId: null, user: null };
    }
}

// ─── Dashboard Stats ───────────────────────────────────────
export async function getDashboardStats() {
    const { user } = await getAuthUser();
    const userFilter = user ? { userId: user.id } : {};

    const preventedFailures = await db.riskEvent.count({ where: { verdict: "BLOCKED", ...userFilter } });
    const activeWorkflows = await db.workflow.count({ where: { status: "ACTIVE", ...(user ? { creatorId: user.id } : {}) } });
    const estimatedSavings = preventedFailures * 1500;

    const recentEvents = await db.riskEvent.findMany({
        where: userFilter,
        take: 10, orderBy: { createdAt: 'desc' }, select: { riskScore: true }
    });

    const avgRiskScore = recentEvents.length > 0
        ? Math.round(recentEvents.reduce((acc, curr) => acc + curr.riskScore, 0) / recentEvents.length)
        : 14;

    return { preventedFailures, activeWorkflows, estimatedSavings, riskScore: avgRiskScore };
}

// ─── Workflows (Zod Validated) ─────────────────────────────
export async function createWorkflow(formData: FormData) {
    const { user } = await getAuthUser();
    if (!user) throw new Error("User not found. Ensure webhooks are configured.");

    const parsed = WorkflowSchema.safeParse({
        name: formData.get("name"),
        type: formData.get("type"),
        description: formData.get("description"),
    });

    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "));
    }

    return await db.workflow.create({
        data: {
            ...parsed.data,
            creatorId: user.id,
            status: "ACTIVE",
            config: { checklist: ["Verify environment variables", "Check database connection", "Execute dry run"] }
        }
    });
}

// ─── Risk Events (Zod Validated) ───────────────────────────
export async function logRiskEvent(data: {
    actionType: string;
    riskScore: number;
    verdict: 'BLOCKED' | 'ALLOWED' | 'OVERRIDDEN';
    reasoning: string;
    context: any;
}) {
    const { user } = await getAuthUser();

    const parsed = RiskEventSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "));
    }

    const event = await db.riskEvent.create({
        data: {
            ...parsed.data,
            userId: user?.id || null
        }
    });

    // Automatic Blockchain Anchoring (Fire & Forget for Demo)
    anchorAuditLogs().catch(err => console.error("Auto-anchor failed:", err));

    return event;
}

// ─── Recent Events ─────────────────────────────────────────
export async function getRecentRiskEvents() {
    const { user } = await getAuthUser();
    const userFilter = user ? { userId: user.id } : {};

    return await db.riskEvent.findMany({
        where: userFilter,
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: true, auditLogs: true }
    });
}

// ─── Chart Data: Risk Score Over Time ──────────────────────
export async function getRiskTrendData() {
    const { user } = await getAuthUser();
    const userFilter = user ? { userId: user.id } : {};

    const events = await db.riskEvent.findMany({
        where: userFilter,
        take: 30,
        orderBy: { createdAt: 'asc' },
        select: { riskScore: true, createdAt: true, verdict: true }
    });

    return events.map((e, i) => ({
        index: i + 1,
        score: e.riskScore,
        time: e.createdAt.toISOString(),
        verdict: e.verdict
    }));
}

// ─── Chart Data: Verdict Distribution ──────────────────────
export async function getVerdictDistribution() {
    const { user } = await getAuthUser();
    const userFilter = user ? { userId: user.id } : {};

    const blocked = await db.riskEvent.count({ where: { verdict: "BLOCKED", ...userFilter } });
    const allowed = await db.riskEvent.count({ where: { verdict: "ALLOWED", ...userFilter } });
    const overridden = await db.riskEvent.count({ where: { verdict: "OVERRIDDEN", ...userFilter } });

    return [
        { name: "Blocked", value: blocked, fill: "#f43f5e" },
        { name: "Safe Patch", value: allowed, fill: "#10b981" },
        { name: "Overridden", value: overridden, fill: "#f59e0b" },
    ];
}

// ─── Blockchain Anchoring ──────────────────────────────────
export async function anchorAuditLogs() {
    const { user } = await getAuthUser();
    const userFilter = user ? { userId: user.id } : {};

    const unanchoredEvents = await db.riskEvent.findMany({
        where: { auditLogs: { none: {} }, ...userFilter },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    if (unanchoredEvents.length === 0) {
        return { message: "No events to anchor.", count: 0 };
    }

    const auditEntries = [];
    for (const event of unanchoredEvents) {
        const log = await db.auditLog.create({
            data: {
                event: `${event.verdict}: ${event.actionType}`,
                details: event.reasoning || "No details",
                riskEventId: event.id,
                blockchainHash: null
            }
        });
        auditEntries.push(log);
    }

    const { hashAuditBatch } = await import("./blockchain");
    const batchData = auditEntries.map(l => ({
        id: l.id, event: l.event, createdAt: l.createdAt.toISOString()
    }));
    const rootHash = hashAuditBatch(batchData);

    const { anchorHashOnChain } = await import("./blockchain");
    const txHash = await anchorHashOnChain(rootHash, `Batch of ${auditEntries.length} audit logs`);

    if (txHash) {
        for (const entry of auditEntries) {
            await db.auditLog.update({ where: { id: entry.id }, data: { blockchainHash: txHash } });
        }
    }

    return {
        message: txHash
            ? `Anchored ${auditEntries.length} logs. TX: ${txHash}`
            : `Created ${auditEntries.length} audit entries. Blockchain anchor skipped (no contract configured).`,
        count: auditEntries.length, rootHash, txHash
    };
}

// ─── Audit Logs ────────────────────────────────────────────
export async function getAuditLogs() {
    const { user } = await getAuthUser();
    const userFilter = user ? { riskEvent: { userId: user.id } } : {};

    return await db.auditLog.findMany({
        where: userFilter,
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: { riskEvent: { include: { user: true } } }
    });
}

// ─── Settings ──────────────────────────────────────────────
const SettingsSchema = z.object({
    riskThreshold: z.number().min(10).max(100),
    fridayBlock: z.boolean(),
    prodOnly: z.boolean(),
    notifications: z.boolean(),
});

export async function getSettings() {
    const { user } = await getAuthUser();
    if (!user) return { riskThreshold: 70, fridayBlock: true, prodOnly: true, notifications: true };

    const settings = await db.engineSettings.findUnique({
        where: { userId: user.id }
    });

    return settings || { riskThreshold: 70, fridayBlock: true, prodOnly: true, notifications: true };
}

export async function saveSettings(data: {
    riskThreshold: number;
    fridayBlock: boolean;
    prodOnly: boolean;
    notifications: boolean;
}) {
    const { user } = await getAuthUser();
    if (!user) throw new Error("Please sign in to save settings.");

    const parsed = SettingsSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "));
    }

    const settings = await db.engineSettings.upsert({
        where: { userId: user.id },
        update: parsed.data,
        create: { ...parsed.data, userId: user.id },
    });

    return settings;
}
