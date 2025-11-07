import express from "express";
import { listarPacientes, crearPaciente } from "../controllers/pacientes.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// cualquier usuario autenticado puede listar
router.get("/", requireAuth(), listarPacientes);

// solo ADMIN o MEDICO pueden crear
router.post("/", requireAuth(["ADMIN", "MEDICO"]), crearPaciente);

export default router;
