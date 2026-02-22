import { NextResponse } from 'next/server';
import db from '@/lib/db';

const ENGINE_URL = process.env.ENGINE_URL || "https://engine-production-0c83.up.railway.app";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { actionType, environment, payload, operatorId } = body;

        // 1. Call Intelligence Layer (Python FastAPI)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${ENGINE_URL}/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action_type: actionType,
                environment,
                payload: payload || {},
                operator_id: operatorId || 'unknown'
            }),
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Risk Engine returned ${response.status}`);
        }

        const engineResult = await response.json();

        // 2. Persist to Database (Audit Store)
        const verdict = engineResult.verdict === 'BLOCK' ? 'BLOCKED'
            : engineResult.verdict === 'ALLOW' ? 'ALLOWED'
                : engineResult.verdict === 'WARN' ? 'BLOCKED' : engineResult.verdict;

        try {
            // Find the user by operatorId
            let userId = null;
            if (operatorId && operatorId !== 'unknown' && operatorId !== 'dashboard-user') {
                const user = await db.user.findFirst({
                    where: { OR: [{ clerkId: operatorId }, { name: { contains: operatorId } }] }
                });
                if (user) userId = user.id;
            }

            await db.riskEvent.create({
                data: {
                    actionType: actionType || 'CLI_COMMAND',
                    riskScore: engineResult.risk_score,
                    verdict,
                    reasoning: (engineResult.reasoning || []).join(' | '),
                    context: {
                        ...payload,
                        ml_confidence: engineResult.ml_confidence,
                        is_anomaly: engineResult.is_anomaly,
                        breakdown: engineResult.breakdown
                    } as any,
                    userId,
                }
            });
        } catch (dbErr) {
            console.warn('[Audit] DB write failed, continuing:', dbErr);
        }

        const finalBreakdown = engineResult.breakdown || {
            rules: engineResult.rules || 0,
            ml_boost: engineResult.ml_boost || 0,
            anomaly_penalty: engineResult.anomaly_penalty || 0,
            final_score: engineResult.risk_score || 0
        };

        return NextResponse.json({
            riskScore: engineResult.risk_score,
            verdict: engineResult.verdict,
            reasoning: engineResult.reasoning,
            mlConfidence: engineResult.ml_confidence,
            isAnomaly: engineResult.is_anomaly,
            breakdown: finalBreakdown,
            planning: engineResult.planning
        });
    } catch (error) {
        console.error("Fetch Error to Engine:", error);
        return NextResponse.json({
            riskScore: 50,
            verdict: 'WARN',
            reasoning: ['Assure Risk Service is temporarily unavailable. Fail-safe caution engaged.'],
            mlConfidence: 0
        }, { status: 503 });
    }
}
