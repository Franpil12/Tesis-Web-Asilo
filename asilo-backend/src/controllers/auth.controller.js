import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ error: "correo y password son requeridos" });
    }

    const user = await prisma.usuario.findUnique({ where: { correo } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { sub: user.id, rol: user.rol, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // devolvemos datos mínimos
    res.json({
      token,
      usuario: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol }
    });
  } catch (e) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const profile = async (req, res) => {
  try {
    const { sub } = req.user; // sub = id del usuario dentro del token

    const user = await prisma.usuario.findUnique({
      where: { id: sub },
      select: { id: true, nombre: true, correo: true, rol: true, creadoEn: true },
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ usuario: user });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

