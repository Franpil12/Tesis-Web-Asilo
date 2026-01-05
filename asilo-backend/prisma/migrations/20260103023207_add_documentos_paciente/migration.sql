-- CreateEnum
CREATE TYPE "AreaDocumento" AS ENUM ('SOCIAL', 'MEDICO', 'PSICOLOGICO', 'FISICO', 'ENFERMERIA');

-- CreateTable
CREATE TABLE "DocumentoPaciente" (
    "id" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "area" "AreaDocumento" NOT NULL,
    "titulo" TEXT,
    "nombreOriginal" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tamanoBytes" INTEGER NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "DocumentoPaciente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentoPaciente" ADD CONSTRAINT "DocumentoPaciente_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoPaciente" ADD CONSTRAINT "DocumentoPaciente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
