import { PasswordResetDAO } from '../dao/password-reset.dao.js';

export class PasswordResetRepository {
  constructor() {
    this.passwordResetDAO = new PasswordResetDAO();
  }

  async create(userId, token) {
    // Expiracia en 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 
    return await this.passwordResetDAO.create({
      userId,
      token,
      expiresAt,
      used: false
    });
  }

  async findValidToken(token) {
    const reset = await this.passwordResetDAO.findByToken(token);
    
    if (!reset) {
      const error = new Error('Token not found');
      error.code = 'TOKEN_NOT_FOUND';
      throw error;
    }

    // Verificar si expiro
    if (new Date() > new Date(reset.expiresAt)) {
      const error = new Error('Token expired');
      error.code = 'TOKEN_EXPIRED';
      throw error;
    }

    // Verificar si ya fue usado
    if (reset.used) {
      const error = new Error('Token already used');
      error.code = 'TOKEN_USED';
      throw error;
    }

    return reset;
  }

  async markAsUsed(token) {
    return await this.passwordResetDAO.markAsUsed(token);
  }

  async deleteAllForUser(userId) {
    return await this.passwordResetDAO.deleteByUserId(userId);
  }
}