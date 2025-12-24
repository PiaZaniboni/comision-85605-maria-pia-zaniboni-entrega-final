import { Router } from "express";

export const protectedRoutes = Router();

function isAuthenticated(req, res, next) {
    if (req.session?.user) return next();
    return res.status(401).json({ message: 'Not authenticated' });
}

// Ping Protegido: confirma que la barrera funciona sin exponer datos sensibles
protectedRoutes.get('/ping', isAuthenticated, (_req, res) => {
    res.json({ ok: true, message: 'ping protected' });
});