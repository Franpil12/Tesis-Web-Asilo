import express from "express";
import { listarUsuarios, crearUsuario } from "../controllers/usuarios.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// solo usuarios autenticados pueden ver la lista
router.get("/", requireAuth(), listarUsuarios);

// solo ADMIN puede crear nuevos usuarios
router.post("/", requireAuth(["ADMIN"]), crearUsuario);

export default router;
