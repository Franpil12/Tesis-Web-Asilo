import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const hoy = new Date();
  const fn = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - fn.getFullYear();
  const m = hoy.getMonth() - fn.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) edad--;
  return edad;
};

export const listarPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();
    const conEdad = pacientes.map((p) => ({
      ...p,
      edadCalculada: calcularEdad(p.fechaNacimiento),
    }));
    res.json(conEdad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar pacientes" });
  }
};

export const obtenerPaciente = async (req, res) => {
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!paciente) return res.status(404).json({ error: "Paciente no encontrado" });

    res.json({
      ...paciente,
      edadCalculada: calcularEdad(paciente.fechaNacimiento),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener paciente" });
  }
};

export const crearPaciente = async (req, res) => {
  const { cedula, nombre, apellido, fechaNacimiento, sexo, estadoSalud } = req.body;

  try {
    const nuevo = await prisma.paciente.create({
      data: {
        cedula,
        nombre,
        apellido,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        sexo,
        estadoSalud,
      },
    });

    res.status(201).json({
      ...nuevo,
      edadCalculada: calcularEdad(nuevo.fechaNacimiento),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear paciente" });
  }
};

export const actualizarPaciente = async (req, res) => {
  const { cedula, nombre, apellido, fechaNacimiento, sexo, estadoSalud } = req.body;

  try {
    const actualizado = await prisma.paciente.update({
      where: { id: parseInt(req.params.id) },
      data: {
        cedula,
        nombre,
        apellido,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        sexo,
        estadoSalud,
      },
    });

    res.json({
      ...actualizado,
      edadCalculada: calcularEdad(actualizado.fechaNacimiento),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar paciente" });
  }
};

export const eliminarPaciente = async (req, res) => {
  try {
    const pacienteId = parseInt(req.params.id);

    // ✅ 1) borrar paciente en BD (cascade borra DocumentoPaciente)
    await prisma.paciente.delete({
      where: { id: pacienteId },
    });

    // ✅ 2) borrar carpeta física uploads/pacientes/{id}
    const carpetaPaciente = path.join(
      process.cwd(),
      "uploads",
      "pacientes",
      String(pacienteId)
    );

    if (fs.existsSync(carpetaPaciente)) {
      fs.rmSync(carpetaPaciente, { recursive: true, force: true });
    }

    res.json({ mensaje: "Paciente eliminado correctamente (BD + archivos)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar paciente" });
  }
};
