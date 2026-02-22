import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
    // 1. Delete audit logs linked to simulated events
    const deletedLogs = await p.auditLog.deleteMany({
        where: { riskEvent: { actionType: 'SIMULATED_DEPLOY' } }
    });
    console.log('Deleted auditLogs:', deletedLogs.count);

    // 2. Delete the simulated risk events themselves
    const deletedEvents = await p.riskEvent.deleteMany({
        where: { actionType: 'SIMULATED_DEPLOY' }
    });
    console.log('Deleted riskEvents:', deletedEvents.count);

    await p.$disconnect();
    console.log('Done. All fake simulation data purged.');
}

main().catch(console.error);
