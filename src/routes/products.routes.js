import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

export const productsRoutes = Router();

const controller = new ProductController();

/* ---------- Middlewares de proteccion ---------- */
function isAuthenticated(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user. role)) {
      return res. status(403).json({ message: `Forbidden:  requires role ${roles.join(' or ')}` });
    }
    next();
  };
}

// GET /api/products - Listar productos
productsRoutes.get("/", controller.getAll);

// GET /api/products/:id - Obtener producto
productsRoutes.get("/:id", controller.getById);

// POST /api/products - Crear producto (solo admin)
productsRoutes.post("/", isAuthenticated, requireRole(['admin']), controller.create);

// PUT /api/products/:id - Actualizar producto (solo admin)
productsRoutes.put("/:id", isAuthenticated, requireRole(['admin']), controller.update);

// DELETE /api/products/:id - Eliminar producto (solo admin)
productsRoutes.delete("/:id", isAuthenticated, requireRole(['admin']), controller.delete);