import session from "express-session";
import MongoStore from "connect-mongo";

 export function createSessionMW () {
    const { SESSION_SECRET, MONGODB_URI, MONGO_DB, SESSION_TTL_MIN } = process.env;
    if ( !SESSION_SECRET ) { throw new Error("SESSION_SECRET is not defined in environment variables"); }

    const store = MongoStore.create({
        mongoUrl : MONGODB_URI + MONGO_DB,
        ttl : Number ( SESSION_TTL_MIN * 60 ),
        autoRemove : 'interval',
        autoRemoveInterval : 10
    });

    return session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: Number ( SESSION_TTL_MIN) * 60 * 1000,
            //secure: String (process.env.COOKIE_SECURE || 'false') === 'true'
        }
    })
}