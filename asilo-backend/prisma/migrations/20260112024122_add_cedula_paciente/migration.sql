/*
  Warnings:

  - A unique constraint covering the columns `[cedula]` on the table `Paciente` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "cedula" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cedula_key" ON "Paciente"("cedula");
