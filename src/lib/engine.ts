const ENGINE_URL = process.env.RISK_ENGINE_URL || "http://localhost:8000";

export async function evaluateRisk(data: {
    action_type: string;
    environment: string;
    payload?: any;
    threshold?: number;
}) {
    try {
        const response = await fetch(`${ENGINE_URL}/evaluate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Risk Engine unavailable");
        }

        return await response.json();
    } catch (error) {
        console.error("Risk Evaluation Failed:", error);
        // Fallback to a safe but cautious score if engine is down
        return {
            risk_score: 50,
            verdict: "WARN",
            reasoning: ["Risk Engine unreachable. Falling back to default safety mode."],
            confidence: 0.5
        };
    }
}
