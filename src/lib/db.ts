import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const db = globalForPrisma.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Retry wrapper for Neon's cold-start timeouts.
 * Wraps any async DB operation with exponential backoff.
 * 
 * Usage:
 *   const user = await withRetry(() => db.user.findUnique({ where: { id } }));
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 500
): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            const isConnectionError =
                error?.message?.includes("Can't reach database server") ||
                error?.message?.includes("Connection refused") ||
                error?.message?.includes("connect ETIMEDOUT") ||
                error?.code === "P1001" || // Prisma: Can't reach database
                error?.code === "P1002";   // Prisma: Timed out

            if (isConnectionError && attempt < retries) {
                const wait = delayMs * Math.pow(2, attempt - 1); // 500, 1000, 2000
                console.warn(`[DB] Connection failed (attempt ${attempt}/${retries}). Retrying in ${wait}ms...`);
                await new Promise((r) => setTimeout(r, wait));
                continue;
            }

            throw error; // Not a connection error, or last attempt — rethrow
        }
    }

    throw new Error("Unreachable");
}
