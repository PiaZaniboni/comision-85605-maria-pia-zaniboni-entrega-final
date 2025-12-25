import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";

export const cartsRoutes = Router();

const controller = new CartController();

/* ---------- Middlewares de proteccion ---------- */
function isAuthenticated(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: requires role ${roles.join(' or ')}` });
    }
    next();
  };
}

// POST /api/carts - Crear carrito
cartsRoutes.post("/", controller.create);

// GET /api/carts/:cid - Obtener carrito
cartsRoutes.get("/:cid", controller.getById);

// POST /api/carts/:cid/products/:pid - Agregar producto (solo user)
cartsRoutes.post("/:cid/products/:pid", isAuthenticated, requireRole(['user']), controller.addProduct);

// DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito
cartsRoutes.delete("/:cid/products/:pid", isAuthenticated, controller.removeProduct);

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad
cartsRoutes.put("/:cid/products/:pid", isAuthenticated, controller.updateProductQuantity);

// DELETE /api/carts/:cid - Vaciar carrito
cartsRoutes.delete("/:cid", isAuthenticated, controller.clearCart);