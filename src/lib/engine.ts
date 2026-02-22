"use server";

const BACKEND_URL = process.env.ASSURE_BACKEND_URL || "http://127.0.0.1:3001";

export async function evaluateRisk(data: {
    action_type: string;
    environment: string;
    payload?: any;
    threshold?: number;
}) {
    console.log("[Engine Bridge] Initiating evaluation for:", data.action_type);
    try {
        console.log("[Engine Bridge] Targeting backend:", BACKEND_URL);
        const response = await fetch(`${BACKEND_URL}/v2/risk/evaluate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                actionType: data.action_type,
                environment: data.environment,
                payload: { ...data.payload, threshold: data.threshold },
                operatorId: "dashboard-user"
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error("[Engine Bridge] Backend error status:", response.status);
            console.error("[Engine Bridge] Backend error body:", errorText);
            throw new Error("Assure Backend unavailable");
        }

        const result = await response.json();
        console.log("[Engine Bridge] Success! Mapped result score:", result.riskScore);

        // Map Phase 2 backend response to UI format
        return {
            risk_score: result.riskScore,
            verdict: result.verdict,
            reasoning: result.reasoning,
            confidence: result.mlConfidence,
            is_anomaly: result.isAnomaly,
            breakdown: result.breakdown,
            planning: result.planning
        };
    } catch (error) {
        console.error("Assure Evaluation Failed:", error);
        return {
            risk_score: 50,
            verdict: "WARN",
            reasoning: ["Assure Control Plane unreachable. Falling back to default safety mode."],
            confidence: 0
        };
    }
}
