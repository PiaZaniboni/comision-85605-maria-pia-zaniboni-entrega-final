import { Router } from "express";
import { User } from "../models/User.model.js";

export const usersRoutes = Router();

/* ---------- Middlewares de proteccion ---------- */
function isAuthenticated(req, res, next) {
    if (req.session?.user) return next();
    return res.status(401).json({ message: 'Not authenticated' });
}

function authorize(role) {
    return (req, res, next) => {
        if (!req.session?.user) return res.status(401).json({ message: 'Unauthorized' });
        if (req.session.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: require rol ' + role });
        }
        next();
    }
}

usersRoutes.get("/me", isAuthenticated,  async (req, res, next) => {
    try {
        const id = req.session.user?.id;
        if (!id) return res.status(400).json({ error: 'Bad Request: Session without ID: This endpoint reads from the database. Log in with a real user.' });

        const user = await User.findById(id).select('first_name last_name email age role').lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    }catch (err) { next(err); }

});



// GET lista (solo admin) /api/user
usersRoutes.get("/", isAuthenticated, authorize('admin'), async (req, res, next) => {
    try {
        const users = await User.find().select('first_name last_name email role age').lean();
        res.json(users);
    }catch (err) { next(err); }
});

// GET user by id (solo admin) /api/users/:id
usersRoutes.get("/:id", isAuthenticated, async (req, res, next) => {
    try{
        const id = req.params.id;
        const user = await User.findById( id ).select('first_name last_name email role age').lean();
        if(!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    }catch (err) { next(err); } 
});

// POST crear usuario (solo admin) /api/users
usersRoutes.post("/", isAuthenticated, authorize('admin'), async (req, res, next) => {
    try{
        const { first_name, last_name, age, email, password, cart,role } = req.body || {};
        if (!first_name || !last_name || age == null || !email || !password) {
            return res.status(422).json({ message: 'first_name, last_name, age, email, password are mandatory' });
        }
        const user = await User.create({ first_name, last_name, age, email, password, cart: cart || null, role: role || 'user' });
        res.status(201).location(`/api/users/${user._id}`).json({ 
            id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, age: user.age 
        });
    }catch (err) { next(err); } 
});

// PUT /api/users/:id (solo admin) 
usersRoutes.put( "/:id", isAuthenticated, authorize('admin'), async(req,res,next)=>{
    try{
        const { first_name, last_name, age, email, cart,role } = req.body || {};
        if (!first_name || !last_name || age == null || !email || !password) {
            return res.status(422).json({ message: 'first_name, last_name, age, email, password are mandatory' });
        }
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { first_name, last_name, age, email, cart, role },
            { new:true, runValidators:true }
        ).select('first_name last_name age email cart role').lean();

        if(!updated) return res.status(404).json({ error: "User not found" });
        res.json(updated);
    } catch (err) { next(err);} 
});

usersRoutes.patch( "/:id", isAuthenticated, authorize('admin'), async(req,res,next)=>{
    try{
        const allowed = [ "first_name", "last_name", "age", "email", "cart", "role" ];
        const $set = Object.fromEntries(
            Object.entries( req.body || {} ).filter( ([ key ]) => allowed.includes( key ) )
        );
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { $set },
            { new:true, runValidators:true }
        ).select('first_name last_name age email cart role').lean();

        if(!updated) return res.status(404).json({ error: "User not found" });
        res.json(updated);
    } catch (err) { next(err);} 
});


// DELETE /api/users/:id (solo admin)
usersRoutes.delete( "/id", isAuthenticated, authorize('admin'), async( req,res,next ) => {
    try{
        const id = req.params.id;
        const deleted = await User.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json({ error: "User not found" });
        res.status(204).send();
    } catch (err) { next(err);} 
} );