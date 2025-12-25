import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema. Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  token: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  expiresAt: { 
    type: Date, 
    required: true
  },
  used: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

//Para eliminar tokens expirados automaticamente
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);