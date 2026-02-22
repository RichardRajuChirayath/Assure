import { FastifyInstance } from 'fastify';
import { RiskRequestSchema, RiskResponseSchema } from '../schemas/risk.js';
import { createRequire } from 'module';
import path from 'path';

// Use the root project's generated Prisma client (not backend's own)
let prisma: any = null;
try {
    const require = createRequire(path.join(process.cwd(), 'src', 'dummy.js'));
    const { PrismaClient } = require('../../node_modules/@prisma/client');
    prisma = new PrismaClient();
    console.log('[Backend] ✅ Prisma client loaded from root project.');
} catch (e) {
    console.warn('[Backend] Could not load Prisma client from root project. DB persistence disabled.', e);
}

export default async function riskRoutes(server: FastifyInstance) {
    server.post('/evaluate', async (request, reply) => {
        const { actionType, environment, payload, operatorId } = request.body as any;

        try {
            // 1. Call Intelligence Layer (Python FastAPI)
            const engineUrl = 'http://127.0.0.1:8000';
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(`${engineUrl}/evaluate`, {
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
                const errBody = await response.text().catch(() => 'no body');
                console.error(`[Engine] HTTP ${response.status}: ${errBody}`);
                throw new Error(`Risk Engine returned ${response.status}`);
            }


            const engineResult = await response.json();

            // 2. Persist to Database (Audit Store)
            const verdict = engineResult.verdict === 'BLOCK' ? 'BLOCKED'
                : engineResult.verdict === 'ALLOW' ? 'ALLOWED'
                    : engineResult.verdict === 'WARN' ? 'BLOCKED' : engineResult.verdict;

            if (prisma) {
                try {
                    // Find the user by operatorId (which maps to clerkId or name)
                    let userId: string | null = null;
                    if (operatorId && operatorId !== 'unknown' && operatorId !== 'dashboard-user') {
                        const user = await prisma.user.findFirst({
                            where: { OR: [{ clerkId: operatorId }, { name: { contains: operatorId } }] }
                        });
                        if (user) userId = user.id;
                    }

                    await prisma.riskEvent.create({
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
                    console.log(`[Audit] ✅ Persisted: ${actionType}, Score: ${engineResult.risk_score}, Verdict: ${verdict}`);
                } catch (dbErr) {
                    console.warn('[Audit] DB write failed, continuing:', dbErr);
                }
            } else {
                console.log(`[Audit] Action: ${actionType}, Score: ${engineResult.risk_score}, Verdict: ${verdict} (DB disabled)`);
            }

            const finalBreakdown = engineResult.breakdown || {
                rules: engineResult.rules || 0,
                ml_boost: engineResult.ml_boost || 0,
                anomaly_penalty: engineResult.anomaly_penalty || 0,
                final_score: engineResult.risk_score || 0
            };

            const responseBody = {
                riskScore: engineResult.risk_score,
                verdict: engineResult.verdict,
                reasoning: engineResult.reasoning,
                mlConfidence: engineResult.ml_confidence,
                isAnomaly: engineResult.is_anomaly,
                breakdown: finalBreakdown,
                planning: engineResult.planning
            };

            return responseBody;
        } catch (error) {
            console.error("Fetch Error to Engine:", error);
            server.log.error(error);
            // Fail-safe: High caution warning
            return reply.status(503).send({
                riskScore: 50,
                verdict: 'WARN',
                reasoning: ['Assure Risk Service is temporarily unavailable. Fail-safe caution engaged.'],
                mlConfidence: 0
            });
        }
    });
}
