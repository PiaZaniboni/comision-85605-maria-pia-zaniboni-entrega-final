import { Router } from "express";
import { User } from "../models/User.model.js";
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

export const sessionRoutes = Router();

const COOKIE = process.env.COOKIE_NAME || 'currentUser';
const IS_PROD = process.env.NODE_ENV === 'production';
const { JWT_SECRET, JWT_EXPIRES = '15m' } = process.env;
const sign = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// POST REGISTER, crear nuevo usuario
sessionRoutes.post('/register', async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body || {};

        if (!first_name || !last_name || !email || age == null || !password) {
            return res.status(400).json({ message: 'Missing required fields: first_name, last_name, age, email, password' });
        }

        const normEmail = String(email).toLowerCase().trim();

        const isAdmin = normEmail.includes("admin");

        const user = await User.create({
            first_name,
            last_name,
            email: normEmail,
            age,
            password,
            cart: cart ?? null,
            role: isAdmin ? "admin" : "user"
        });
        res.status(201).json({ ok: true, id: user._id });

    } catch (err) {
        if (err?.code === 11000) return res.status(409).json({ message: 'Email already registered' });
        return next(err);
    }
});

/* LOGIN (Passport + logs) */
sessionRoutes.post('/login', (req, res, next) => {

  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const token = sign({ sub: user.id, email: user.email, role: user.role });

    res.cookie(COOKIE, token, {
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: IS_PROD,
      maxAge: 15 * 60 * 1000,
      path: '/'
    });

    const wantsHtml =
      req.headers.accept && req.headers.accept.includes('text/html');

    if (wantsHtml) {
      return res.redirect('/current');
    }

    return res.json({ ok: true });
  })(req, res, next);
});

// CURRENT - privada
sessionRoutes.get('/current', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

//Log out
sessionRoutes.get('/logout', (_req, res) => {
  res.clearCookie(COOKIE, { path: '/' });
  if (_req.headers.accept?.includes('text/html')) {
    return res.redirect('/login');
  }

  return res.json({ ok: true, message: 'Token eliminado' });
});
