import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts', default: null },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, ROUNDS);
        next();
    }catch (err) {
        return next(err);
    }
});

export const User = mongoose.model('User', UserSchema);