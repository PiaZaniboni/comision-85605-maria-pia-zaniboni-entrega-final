import { Router } from "express";
import { SessionController } from "../controllers/session.controller.js";
import passport from '../config/passport.js';

export const sessionRoutes = Router();

const controller = new SessionController();

// POST /api/sessions/register - Registro publico
sessionRoutes.post('/register', controller.register);

// POST /api/sessions/login - Login
sessionRoutes.post('/login', controller.login);

// GET /api/sessions/current - Usuario actual (requiere autenticacion)
sessionRoutes.get('/current', controller. getCurrent);

// GET /api/sessions/logout - Log out
sessionRoutes.get('/logout', controller.logout);