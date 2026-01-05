import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middlewares/auth.js";

const prisma = new PrismaClient();
const auth = requireAuth(); // si luego quieres roles: requireAuth(["ADMIN","MEDICO"])
const router = Router();

// ✅ Áreas válidas y mapeo al enum de Prisma
const AREAS_VALIDAS = ["social", "medico", "psicologico", "fisico", "enfermeria"];

const areaToEnum = (area) => {
  const map = {
    social: "SOCIAL",
    medico: "MEDICO",
    psicologico: "PSICOLOGICO",
    fisico: "FISICO",
    enfermeria: "ENFERMERIA",
  };
  return map[area];
};

// ✅ Configurar almacenamiento dinámico (por paciente y área)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { pacienteId, area } = req.params;
    const areaLower = String(area).toLowerCase();

    if (!AREAS_VALIDAS.includes(areaLower)) {
      return cb(new Error("Área inválida"), null);
    }

    // carpeta: uploads/pacientes/ID/area
    const folder = path.join(
      "uploads",
      "pacientes",
      String(pacienteId),
      areaLower
    );

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .pdf
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

// ✅ Solo PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Solo se permiten archivos PDF"), false);
};

const upload = multer({ storage, fileFilter });

/**
 * ✅ SUBIR DOCUMENTO
 * POST /api/documentos/:area/:pacienteId
 * form-data: archivo (PDF), titulo(opcional)
 */
router.post(
  "/:area/:pacienteId",
  auth,
  upload.single("archivo"),
  async (req, res) => {
    try {
      const pacienteId = Number(req.params.pacienteId);
      const areaLower = String(req.params.area).toLowerCase();

      if (!AREAS_VALIDAS.includes(areaLower)) {
        return res.status(400).json({ message: "Área inválida" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No se envió el archivo" });
      }

      // verificar paciente existe
      const paciente = await prisma.paciente.findUnique({
        where: { id: pacienteId },
      });
      if (!paciente) {
        return res.status(404).json({ message: "Paciente no encontrado" });
      }

      // guardar registro en BD
      const doc = await prisma.documentoPaciente.create({
        data: {
          pacienteId,
          area: areaToEnum(areaLower),
          titulo: req.body.titulo || `Documento ${areaLower}`,
          nombreOriginal: req.file.originalname,
          mimeType: req.file.mimetype,
          tamanoBytes: req.file.size,
          rutaArchivo: req.file.path.replace(/\\/g, "/"),
          usuarioId: req.user?.id || null,
        },
      });

      return res.status(201).json({ message: "Documento subido", doc });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al subir documento" });
    }
  }
);

/**
 * ✅ LISTAR DOCUMENTOS POR ÁREA
 * GET /api/documentos/:area/:pacienteId
 */
router.get("/:area/:pacienteId", auth, async (req, res) => {
  try {
    const pacienteId = Number(req.params.pacienteId);
    const areaLower = String(req.params.area).toLowerCase();

    if (!AREAS_VALIDAS.includes(areaLower)) {
      return res.status(400).json({ message: "Área inválida" });
    }

    const docs = await prisma.documentoPaciente.findMany({
      where: { pacienteId, area: areaToEnum(areaLower) },
      orderBy: { creadoEn: "desc" },
    });

    return res.json(docs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al listar documentos" });
  }
});

export default router;
