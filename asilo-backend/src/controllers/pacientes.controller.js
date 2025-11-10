import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listarPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: "Error al listar pacientes" });
  }
};

export const obtenerPaciente = async (req, res) => {
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!paciente)
      return res.status(404).json({ error: "Paciente no encontrado" });
    res.json(paciente);
  } catch {
    res.status(500).json({ error: "Error al obtener paciente" });
  }
};

export const crearPaciente = async (req, res) => {
  const { nombre, apellido, edad, sexo, estadoSalud } = req.body;
  try {
    const nuevo = await prisma.paciente.create({
      data: { nombre, apellido, edad:edad ? parseInt(edad) : nul, sexo, estadoSalud },
    });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear paciente" });
  }
};

export const actualizarPaciente = async (req, res) => {
  const { nombre, apellido, edad, sexo, estadoSalud } = req.body;
  try {
    const actualizado = await prisma.paciente.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, apellido, edad, sexo, estadoSalud },
    });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar paciente" });
  }
};

export const eliminarPaciente = async (req, res) => {
  try {
    await prisma.paciente.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ mensaje: "Paciente eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar paciente" });
  }
};

