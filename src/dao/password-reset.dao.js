import { PasswordReset } from '../models/PasswordReset.model.js';

export class PasswordResetDAO {
  
  async create(resetData) {
    return await PasswordReset.create(resetData);
  }

  async findByToken(token) {
    return await PasswordReset.findOne({ token }).lean();
  }

  async markAsUsed(token) {
    return await PasswordReset. findOneAndUpdate(
      { token },
      { used: true },
      { new:  true }
    ).lean();
  }

  async deleteByUserId(userId) {
    return await PasswordReset.deleteMany({ userId });
  }
}