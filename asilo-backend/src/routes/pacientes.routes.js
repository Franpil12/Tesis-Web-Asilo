import { Router } from "express";
import {
  listarPacientes,
  obtenerPaciente,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from "../controllers/pacientes.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// Cualquier usuario autenticado puede listar o ver detalles
router.get("/", requireAuth(), listarPacientes);
router.get("/:id", requireAuth(), obtenerPaciente);

// Solo ADMIN o MÉDICO pueden crear, editar y eliminar
router.post("/", requireAuth(["ADMIN", "MEDICO"]), crearPaciente);
router.put("/:id", requireAuth(["ADMIN", "MEDICO"]), actualizarPaciente);
router.delete("/:id", requireAuth(["ADMIN"]), eliminarPaciente);

export default router;
