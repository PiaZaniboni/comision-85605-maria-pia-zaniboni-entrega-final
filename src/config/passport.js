import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { User } from "../models/User.model.js";

const { JWT_SECRET, COOKIE_NAME = 'currentUser' } = process.env;

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: false },
    async (email, password, done) => {
      try {
        const normEmail = String(email).toLowerCase().trim();
        const user = await User.findOne({ email: normEmail });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, { id: String(user._id), email: user.email, role: user.role || 'user' });
      } catch (err) {
        return done(err);
      }
    }
  )
);

/* JWT */
const bearer = ExtractJwt.fromAuthHeaderAsBearerToken();
const cookieExtractor = (req) =>
  req?.signedCookies?.[COOKIE_NAME] || req?.cookies?.[COOKIE_NAME] || null;

passport.use('jwt', new JwtStrategy(
  { jwtFromRequest: ExtractJwt.fromExtractors([bearer, cookieExtractor]), secretOrKey: JWT_SECRET },
  (payload, done) => {
    try { return done(null, { id: payload.sub, email: payload.email, role: payload.role }); }
    catch (e) { return done(e, false); }
  }
));

export const initPassport = (app) => app.use(passport.initialize());
export default passport;