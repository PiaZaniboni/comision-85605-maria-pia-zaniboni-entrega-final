
import express, { json, urlencoded } from 'express';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { engine } from 'express-handlebars';
import { initPassport } from './config/passport.js';

import { sessionRoutes }  from  "./routes/sessions.routes.js";
import { protectedRoutes }   from  "./routes/protected.routes.js";
import { usersRoutes } from "./routes/users.routes.js";
import { viewsRoutes } from "./routes/views.routes.js";

import { attachUserFromCookie } from './middlewares/auth-cookie.js';
import erroHandler from "./middlewares/error.handler.js";

const app = express();

//middlewares base
app.use(helmet());
app.use(cors({origin: true, credentials: true}));
app.use(morgan("dev")); //Logs https
app.use(json());
app.use(urlencoded({ extended: true }));

/* Cookies firmadas; necesarias para leer las cookie desde  req.signedCookies */
app.use(cookieParser(process.env.COOKIE_SECRET));

//Css
app.use(express.static('public'));

//Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Passport stateless
initPassport(app)
app.use(attachUserFromCookie);

//health, ruta para ver que la api esta en funcionamiento
app.get("/health", (_req,res)=> res.json({ok:true}));

//Router
app.use("/api/sessions", sessionRoutes);
app.use("/private", protectedRoutes);
app.use("/api/users", usersRoutes);
app.use("/", viewsRoutes); 

//404
app.use( (_req, res) => res.status(404).json({ message: 'Page not found' }) );

//Manejo de errores
app.use(erroHandler);

export default app;