import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, correo: true, rol: true, creadoEn: true },
      orderBy: { id: "asc" }
    });
    res.json(usuarios);
  } catch {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: "nombre, correo y password son requeridos" });
    }
    const exists = await prisma.usuario.findUnique({ where: { correo } });
    if (exists) return res.status(409).json({ error: "El correo ya está registrado" });

    const passwordHash = await bcrypt.hash(password, 10);
    const nuevo = await prisma.usuario.create({
      data: { nombre, correo, passwordHash, rol }
    });

    res.status(201).json({
      message: "Usuario creado",
      usuario: { id: nuevo.id, nombre: nuevo.nombre, correo: nuevo.correo, rol: nuevo.rol }
    });
  } catch {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, correo, rol, password } = req.body;
    const data = { nombre, correo, rol };

    if (password) {
      data.password = await bcrypt.hash(passwordHash, 10);
    }

    const actualizado = await prisma.usuario.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    await prisma.usuario.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};