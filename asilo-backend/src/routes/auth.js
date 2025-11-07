import express from "express";
import { login, profile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);

// Nueva ruta protegida para obtener perfil
router.get("/profile", requireAuth(), profile);

export default router;