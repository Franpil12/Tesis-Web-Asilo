import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function fechaAproximadaDesdeEdad(edad) {
  const hoy = new Date();
  const fn = new Date(hoy);
  fn.setFullYear(hoy.getFullYear() - Number(edad));
  return fn;
}

async function main() {
  const pacientes = await prisma.paciente.findMany({
    where: {
      fechaNacimiento: null,
      edad: { not: null },
    },
    select: { id: true, edad: true },
  });

  console.log("Pacientes a migrar:", pacientes.length);

  for (const p of pacientes) {
    const fn = fechaAproximadaDesdeEdad(p.edad);

    await prisma.paciente.update({
      where: { id: p.id },
      data: { fechaNacimiento: fn },
    });
  }

  console.log("✅ Migración completada.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
