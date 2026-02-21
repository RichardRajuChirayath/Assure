import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * Health check endpoint for uptime monitoring (Uptime Kuma compatible).
 * Returns system status, database connectivity, and engine availability.
 */
export async function GET() {
    const checks: Record<string, string> = {};
    let healthy = true;

    // 1. Database check
    try {
        await db.$queryRaw`SELECT 1`;
        checks.database = "ok";
    } catch {
        checks.database = "error";
        healthy = false;
    }

    // 2. Python engine check
    try {
        const engineUrl = process.env.RISK_ENGINE_URL || "http://localhost:8000";
        const res = await fetch(engineUrl, { signal: AbortSignal.timeout(3000) });
        checks.engine = res.ok ? "ok" : "degraded";
    } catch {
        checks.engine = "offline";
    }

    // 3. Redis check
    try {
        if (process.env.REDIS_URL) {
            const { cacheGet } = await import("@/lib/cache");
            await cacheGet("health_ping");
            checks.redis = "ok";
        } else {
            checks.redis = "not_configured";
        }
    } catch {
        checks.redis = "error";
    }

    return NextResponse.json(
        {
            status: healthy ? "healthy" : "degraded",
            version: "4.0.0",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            checks,
        },
        { status: healthy ? 200 : 503 }
    );
}
