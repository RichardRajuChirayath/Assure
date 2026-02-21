/**
 * Feature Flags — Lightweight Implementation
 * 
 * Uses local JSON config by default. Can be swapped with Unleash
 * by changing the getFlags() function to fetch from Unleash API.
 * 
 * Usage:
 *   import { isEnabled } from "@/lib/flags";
 *   if (await isEnabled("ml_risk_scoring")) { ... }
 */

interface FeatureFlag {
    name: string;
    enabled: boolean;
    description: string;
    rolloutPercent?: number;
}

// ─── Flag Definitions ──────────────────────────────────────
const FLAGS: FeatureFlag[] = [
    {
        name: "blockchain_anchoring",
        enabled: true,
        description: "Enable blockchain audit log anchoring (Polygon Amoy)",
    },
    {
        name: "ml_risk_scoring",
        enabled: false,
        description: "Use ML models (XGBoost/Isolation Forest) for risk scoring instead of rules",
    },
    {
        name: "friday_auto_block",
        enabled: true,
        description: "Automatically block production deploys on Friday afternoons",
    },
    {
        name: "sse_realtime",
        enabled: true,
        description: "Enable Server-Sent Events for real-time dashboard updates",
    },
    {
        name: "redis_caching",
        enabled: false,
        description: "Cache frequently-accessed dashboard queries in Redis",
    },
    {
        name: "shap_explainability",
        enabled: false,
        description: "Show SHAP-based feature importance in risk explanations",
    },
    {
        name: "cli_git_hooks",
        enabled: true,
        description: "Enable CLI guard installation on git hooks",
    },
    {
        name: "payload_scanning",
        enabled: true,
        description: "Scan command payloads for dangerous flags (--force, --hard)",
    },
];

// ─── API ───────────────────────────────────────────────────

/**
 * Check if a feature flag is enabled.
 */
export async function isEnabled(flagName: string): Promise<boolean> {
    // If Unleash is configured, use it
    if (process.env.UNLEASH_API_URL && process.env.UNLEASH_API_KEY) {
        return await checkUnleash(flagName);
    }

    // Otherwise, use local flags
    const flag = FLAGS.find((f) => f.name === flagName);
    if (!flag) return false;

    // Rollout percentage support
    if (flag.rolloutPercent !== undefined && flag.rolloutPercent < 100) {
        return Math.random() * 100 < flag.rolloutPercent;
    }

    return flag.enabled;
}

/**
 * Get all feature flags with their current status.
 */
export function getAllFlags(): FeatureFlag[] {
    return FLAGS;
}

/**
 * Unleash integration (used when UNLEASH_API_URL is configured).
 */
async function checkUnleash(flagName: string): Promise<boolean> {
    try {
        const res = await fetch(
            `${process.env.UNLEASH_API_URL}/api/client/features/${flagName}`,
            {
                headers: {
                    Authorization: process.env.UNLEASH_API_KEY || "",
                },
                signal: AbortSignal.timeout(2000),
            }
        );
        if (!res.ok) return false;
        const data = await res.json();
        return data.enabled ?? false;
    } catch {
        return false;
    }
}
