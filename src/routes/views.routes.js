import { Router } from "express";
import { User } from "../models/User.model.js";

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

    const user = await User.findById(req.user.id)
      .select('first_name last_name email age role')
      .lean();

    res.render('current', { user });
  } catch (err) {
    next(err);
  }
});
