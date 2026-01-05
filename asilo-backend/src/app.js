import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import usuariosRoutes from "./routes/usuarios.routes.js";
import pacientesRoutes from "./routes/pacientes.routes.js";
import authRoutes from "./routes/auth.js";
import documentosRoutes from "./routes/documentos.routes.js";

dotenv.config();

// ✅ PRIMERO crear la app
const app = express();

// ✅ Middlewares base
app.use(cors());
app.use(express.json());

// ✅ Para rutas absolutas (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Servir uploads como archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ✅ Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/documentos", documentosRoutes);

// ✅ Levantar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
