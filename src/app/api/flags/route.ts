import { NextResponse } from "next/server";
import { getAllFlags } from "@/lib/flags";

/**
 * API endpoint to list all feature flags and their status.
 */
export async function GET() {
    return NextResponse.json({
        flags: getAllFlags(),
        source: process.env.UNLEASH_API_URL ? "unleash" : "local",
    });
}
