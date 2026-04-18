/**
 * One-off migration: marca todos los servicios LOCAL como AMBOS
 * con recargo_domicilio = 5000. Idempotente en corridas posteriores
 * (solo toca filas que siguen siendo LOCAL).
 *
 * Run: node --env-file=.env scripts/migrate-servicios-a-ambos.js
 */
const { PrismaClient } = require('@prisma/client');

const RECARGO = 5000;

async function main() {
  const prisma = new PrismaClient();
  try {
    const before = await prisma.servicio.count({ where: { modalidad: 'LOCAL' } });
    console.log(`[migrate] Servicios LOCAL antes: ${before}`);

    const result = await prisma.servicio.updateMany({
      where: { modalidad: 'LOCAL' },
      data: {
        modalidad: 'AMBOS',
        recargo_domicilio: RECARGO,
      },
    });
    console.log(`[migrate] Filas actualizadas: ${result.count}`);

    const [remainingLocal, totalAmbos, totalDomicilio] = await Promise.all([
      prisma.servicio.count({ where: { modalidad: 'LOCAL' } }),
      prisma.servicio.count({ where: { modalidad: 'AMBOS' } }),
      prisma.servicio.count({ where: { modalidad: 'DOMICILIO' } }),
    ]);
    console.log(
      `[migrate] Post-estado — LOCAL: ${remainingLocal}, AMBOS: ${totalAmbos}, DOMICILIO: ${totalDomicilio}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[migrate] Error:', err);
  process.exit(1);
});
