"use server";

const ENGINE_URL = process.env.ENGINE_URL || "http://127.0.0.1:8000";

export async function evaluateRisk(data: {
    action_type: string;
    environment: string;
    payload?: any;
    threshold?: number;
}) {
    console.log("[Engine Bridge] Initiating evaluation for:", data.action_type);
    try {
        console.log("[Engine Bridge] Targeting python engine:", ENGINE_URL);
        const response = await fetch(`${ENGINE_URL}/evaluate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action_type: data.action_type,
                environment: data.environment,
                payload: { ...data.payload, threshold: data.threshold },
                operator_id: "dashboard-user"
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error("[Engine Bridge] Engine error status:", response.status);
            console.error("[Engine Bridge] Engine error body:", errorText);
            throw new Error("Assure Python Engine unavailable");
        }

        const result = await response.json();
        console.log("[Engine Bridge] Success! Mapped result score:", result.risk_score);

        // Map Phase 3.5 Python response to UI format
        return {
            risk_score: result.risk_score,
            verdict: result.verdict,
            reasoning: result.reasoning,
            confidence: result.forensics?.semantic_intent || 0,
            is_anomaly: false,
            breakdown: result.breakdown || result.forensics || {},
            planning: result.planning || null
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
