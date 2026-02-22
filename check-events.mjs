import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
    const events = await db.riskEvent.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { auditLogs: true }
    });
    console.log(JSON.stringify(events, null, 2));
}
main().finally(() => db.$disconnect());
