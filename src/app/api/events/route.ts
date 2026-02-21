import { NextRequest } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Server-Sent Events endpoint for real-time dashboard updates.
 * The client opens a persistent connection and receives live risk events.
 */
export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            // Send initial data
            const stats = await getLatestStats();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(stats)}\n\n`));

            // Poll for updates every 5 seconds
            const interval = setInterval(async () => {
                try {
                    const latest = await getLatestStats();
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(latest)}\n\n`));
                } catch {
                    clearInterval(interval);
                    controller.close();
                }
            }, 5000);

            // Clean up on disconnect
            req.signal.addEventListener("abort", () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}

async function getLatestStats() {
    const [blocked, allowed, overridden, latestEvent] = await Promise.all([
        db.riskEvent.count({ where: { verdict: "BLOCKED" } }),
        db.riskEvent.count({ where: { verdict: "ALLOWED" } }),
        db.riskEvent.count({ where: { verdict: "OVERRIDDEN" } }),
        db.riskEvent.findFirst({
            orderBy: { createdAt: "desc" },
            include: { user: true },
        }),
    ]);

    return {
        type: "stats_update",
        timestamp: new Date().toISOString(),
        blocked,
        allowed,
        overridden,
        total: blocked + allowed + overridden,
        latestEvent: latestEvent
            ? {
                action: latestEvent.actionType,
                verdict: latestEvent.verdict,
                score: latestEvent.riskScore,
                user: latestEvent.user?.name || "System",
                time: latestEvent.createdAt.toISOString(),
            }
            : null,
    };
}
