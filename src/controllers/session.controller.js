import { UserService } from '../services/user.services.js';
import { UserDTO } from '../dto/user.dto.js';
import { PasswordResetService } from '../services/password-reset.service.js';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const COOKIE = process.env. COOKIE_NAME || 'currentUser';
const IS_PROD = process.env.NODE_ENV === 'production';
const { JWT_SECRET, JWT_EXPIRES = '15m' } = process.env;

/**
 * Responsabilidad: Autenticacion y manejo de sesiones
 */
export class SessionController {
  constructor() {
    this.userService = new UserService();
    this.passwordResetService = new PasswordResetService();
  }

  // POST /api/sessions/register - Registro publico
  register = async (req, res, next) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      // Validación
      if (!first_name || ! last_name || !email || age == null || ! password) {
        return res. status(400).json({ 
          message: 'Missing required fields:  first_name, last_name, age, email, password' 
        });
      }

      // IMPORTANTE: En el registro público, NO permitir que el usuario elija su rol
      const userData = {
        first_name,
        last_name,
        email,
        age,
        password,
        cart: null,
      };

      const user = await this.userService.createUser(userData);
      
      res.status(201).json({ 
        ok: true, 
        id: user._id 
      });

    } catch (err) {
      if (err.code === 'EMAIL_EXISTS') {
        return res.status(409).json({ message: 'Email already registered' });
      }
      next(err);
    }
  }

  // POST /api/sessions/login
  login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ 
          error: info?.message || 'Invalid credentials' 
        });
      }

      // Generar JWT
      const token = jwt.sign(
        { sub: user. id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );

      // Establecer cookie
      res.cookie(COOKIE, token, {
        httpOnly: true,
        signed: true,
        sameSite: 'lax',
        secure: IS_PROD,
        maxAge: 15 * 60 * 1000,
        path: '/'
      });

      // Detectar si quiere HTML o JSON
      const wantsHtml = req.headers. accept && req.headers.accept.includes('text/html');

      if (wantsHtml) {
        return res.redirect('/current');
      }

      return res.json({ ok: true });

    })(req, res, next);
  }

  // GET /api/sessions/current - Usuario actual
  getCurrent = async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      // Obtener datos completos del usuario desde la base de datos
      const user = await this. userService.getUserById(req. user.id);
      
      // Usar DTO especifico para current (sin datos sensibles)
      res.json({
        user: UserDTO.forCurrent(user)
      });

    } catch (err) {
      return res.status(404).json({ error: "User not found" });
    }
  }

  // GET /api/sessions/logout
  logout = (_req, res) => {
    res.clearCookie(COOKIE, { path: '/' });
    
    if (_req.headers.accept?. includes('text/html')) {
      return res.redirect('/login');
    }

    return res.json({ ok: true, message: 'Logged out successfully' });
  }

  // ========== RECUPERAR CONTRASENIA ==========
  // POST /api/sessions/forgot-password - Solicitar recuperacion
  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      await this.passwordResetService.requestPasswordReset(email);

      // Siempre retornar success (por seguridad, no revelar si el email existe)
      res.json({ 
        ok: true, 
        message: 'If the email exists, a password reset link has been sent' 
      });

    } catch (err) {
      next(err);
    }
  }

  // GET /api/sessions/reset-password/:token - Validar token
  validateResetToken = async (req, res, next) => {
    try {
      const { token } = req.params;

      await this.passwordResetService.validateResetToken(token);

      res.json({ 
        ok: true, 
        message: 'Token is valid' 
      });

    } catch (err) {
      if (err.code === 'TOKEN_NOT_FOUND') {
        return res.status(404).json({ error: 'Invalid token' });
      }
      if (err.code === 'TOKEN_EXPIRED') {
        return res.status(400).json({ error: 'Token has expired' });
      }
      if (err.code === 'TOKEN_USED') {
        return res.status(400).json({ error: 'Token has already been used' });
      }
      next(err);
    }
  }

  // POST /api/sessions/reset-password/:token - Cambiar contrasenia
  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      await this.passwordResetService.resetPassword(token, password);

      res.json({ 
        ok: true, 
        message: 'Password has been reset successfully' 
      });

    } catch (err) {
      if (err.code === 'TOKEN_NOT_FOUND') {
        return res.status(404).json({ error: 'Invalid token' });
      }
      if (err.code === 'TOKEN_EXPIRED') {
        return res.status(400).json({ error: 'Token has expired' });
      }
      if (err.code === 'TOKEN_USED') {
        return res.status(400).json({ error: 'Token has already been used' });
      }
      if (err.code === 'SAME_PASSWORD') {
        return res.status(400).json({ error: 'New password must be different from the current password' });
      }
      next(err);
    }
  }

}