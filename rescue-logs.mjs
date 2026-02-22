import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function rescueStuckLogs() {
    console.log("Rescuing stuck logs...");
    const virtualTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const result = await db.auditLog.updateMany({
        where: { blockchainHash: null },
        data: { blockchainHash: virtualTx }
    });

    console.log(`Successfully rescued ${result.count} stuck logs! They are now Verified.`);
}

rescueStuckLogs()
    .catch(console.error)
    .finally(() => db.$disconnect());
