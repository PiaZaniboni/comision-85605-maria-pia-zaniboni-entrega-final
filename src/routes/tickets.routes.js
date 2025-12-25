import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";

export const ticketsRoutes = Router();

const controller = new TicketController();

/* ---------- Middlewares de proteccion ---------- */
function isAuthenticated(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  next();
}

// GET /api/tickets/my-tickets - Mis tickets (requiere autenticacion)
ticketsRoutes.get("/my-tickets", isAuthenticated, controller.getMyTickets);

// GET /api/tickets - Listar tickets (admin: todos, user: solo suyos)
ticketsRoutes.get("/", isAuthenticated, controller.getAll);

// GET /api/tickets/: id - Obtener ticket por ID
ticketsRoutes.get("/:id", isAuthenticated, controller.getById);