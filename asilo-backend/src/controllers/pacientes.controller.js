import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listarPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pacientes" });
  }
};

export const crearPaciente = async (req, res) => {
  try {
    const { nombre, apellido, edad, sexo, estadoSalud } = req.body;
    const nuevo = await prisma.paciente.create({
      data: { nombre, apellido, edad, sexo, estadoSalud },
    });
    res.status(201).json({ message: "Paciente creado", paciente: nuevo });
  } catch (error) {
    res.status(500).json({ error: "Error al crear paciente" });
  }
};
