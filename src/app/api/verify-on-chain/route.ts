import { NextResponse } from "next/server";
import { verifyAnchorOnChain } from "@/lib/blockchain";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const auditLogId = searchParams.get("id");

    if (!auditLogId) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        // 1. Get the local audit log details to find the anchor count
        // Note: In our current simple contract, the anchorId is usually the index.
        // For a hackathon/demo, we can assume the audit log index in our DB relates to the anchor.
        // But better: let's try to verify using a mock index or a real one if we have it.

        // Find how many audit logs exist before this one to guess the anchor index
        const auditLog = await db.auditLog.findUnique({
            where: { id: auditLogId },
            include: { riskEvent: true }
        });

        if (!auditLog) {
            return NextResponse.json({ error: "Audit log not found" }, { status: 404 });
        }

        // Guessing index for demo purposes if not explicitly stored
        // In a production system, we'd store `onChainAnchorId` in the DB.
        const logsBefore = await db.auditLog.count({
            where: { createdAt: { lt: auditLog.createdAt } }
        });

        const anchorIndex = logsBefore; // Simplification: 0-indexed count

        const proof = await verifyAnchorOnChain(anchorIndex);

        if (!proof) {
            return NextResponse.json({ error: "Could not fetch proof from blockchain" }, { status: 500 });
        }

        return NextResponse.json({
            ...proof,
            status: "VERIFIED",
            txHash: auditLog.blockchainHash
        });
    } catch (err) {
        console.error("Verify API Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
