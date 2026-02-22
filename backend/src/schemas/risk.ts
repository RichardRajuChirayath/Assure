import { z } from 'zod';

export const RiskRequestSchema = z.object({
    actionType: z.string(),
    environment: z.string(),
    payload: z.record(z.any()).optional(),
    operatorId: z.string().optional(),
});

export type RiskRequest = z.infer<typeof RiskRequestSchema>;

export const RiskResponseSchema = z.object({
    riskScore: z.number(),
    verdict: z.enum(['BLOCK', 'WARN', 'ALLOW']),
    reasoning: z.array(z.string()),
    mlConfidence: z.number(),
    isAnomaly: z.boolean().optional(),
    breakdown: z.object({
        rules: z.number(),
        ml_boost: z.number(),
        anomaly_penalty: z.number(),
        final_score: z.number(),
    }).optional(),
});
