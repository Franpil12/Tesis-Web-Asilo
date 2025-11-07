import jwt from "jsonwebtoken";

export const requireAuth = (roles = []) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) {
        return res.status(401).json({ error: "Token requerido" });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      // Si se especificaron roles, verificamos si coincide
      if (roles.length > 0 && !roles.includes(payload.rol)) {
        return res.status(403).json({ error: "No autorizado" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
  };
};
