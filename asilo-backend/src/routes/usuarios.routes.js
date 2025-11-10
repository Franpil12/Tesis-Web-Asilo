import { Router } from "express";
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuarios.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// Solo el ADMIN puede gestionar usuarios
router.get("/", requireAuth(["ADMIN"]), listarUsuarios);
router.post("/", requireAuth(["ADMIN"]), crearUsuario);
router.put("/:id", requireAuth(["ADMIN"]), actualizarUsuario);
router.delete("/:id", requireAuth(["ADMIN"]), eliminarUsuario);

export default router;
