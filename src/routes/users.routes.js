import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

export const usersRoutes = Router();

const controller = new UserController();

/* ---------- Middlewares de proteccion ---------- */
function isAuthenticated(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: requires role ${roles. join(' or ')}` });
    }
    next();
  };
}

// GET /api/users/me - Usuario actual
usersRoutes.get("/me", isAuthenticated, controller.getMe);

// GET /api/users - Listar todos (solo admin)
usersRoutes.get("/", isAuthenticated, requireRole(['admin']), controller.getAll);

// GET /api/users/:id - Obtener por ID
usersRoutes.get("/:id", isAuthenticated, controller.getById);

// POST /api/users - Crear (solo admin)
usersRoutes.post("/", isAuthenticated, requireRole(['admin']), controller.create);

// PUT /api/users/:id - Actualizar completo (solo admin)
usersRoutes.put("/:id", isAuthenticated, requireRole(['admin']), controller.update);

// PATCH /api/users/:id - Actualizar parcial (solo admin)
usersRoutes.patch("/:id", isAuthenticated, requireRole(['admin']), controller.partialUpdate);

// DELETE /api/users/:id - Eliminar (solo admin)
usersRoutes.delete("/:id", isAuthenticated, requireRole(['admin']), controller.delete);