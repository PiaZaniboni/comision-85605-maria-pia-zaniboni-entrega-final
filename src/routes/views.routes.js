import { Router } from "express";
import UserDTO from '../dto/user.dto.js'

export const viewsRoutes = Router();


viewsRoutes.get('/login', (req, res) => {
  res.render('login');
});


viewsRoutes.get('/register', (req, res) => {
  res.render('register');
});

// Pagina Current (requiere usuario)
viewsRoutes.get('/current', async (req, res) => {
  try {
    if (!req.user) return res.redirect('/login');

    const userDto = new UserDTO(req.user);

    res.render('current', { userDto });
  } catch (err) {
    next(err);
  }
});
