import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
db.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).then(console.log).finally(() => db.$disconnect());
