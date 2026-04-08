const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const citas = await prisma.cita.findMany({
    orderBy: { created_at: 'desc' },
    take: 2,
    include: { cliente: true, servicios: true }
  });
  console.log(JSON.stringify(citas, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
