import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import { PasswordResetRepository } from '../repositories/password-reset.repository.js';
import { EmailService } from './email.service.js';
import { UserDAO } from '../dao/user.dao.js';

const ROUNDS = Number(process.env.BCRYPT_ROUNDS ??  10);

export class PasswordResetService {
  constructor() {
    this.userRepository = new UserRepository();
    this.passwordResetRepository = new PasswordResetRepository();
    this.emailService = new EmailService();
    this.userDAO = new UserDAO();
  }

  /**
   * Solicitar recuperacion de contraseña
   */
  async requestPasswordReset(email) {

    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
        // Para no revelar si el email existe o no, simplemente retornar exito
      return { success: true };
    }

    // Eliminar tokens anteriores del usuario
    await this.passwordResetRepository.deleteAllForUser(user._id || user.id);

    // Generar token unico
    const token = crypto.randomBytes(32).toString('hex');

    // Guardar token en BD
    await this.passwordResetRepository.create(user._id || user.id, token);

    // Enviar email
    await this.emailService.sendPasswordResetEmail(email, token);

    return { success: true };
  }

  /**
   * Validar token de recuperacion
   */
  async validateResetToken(token) {
    return await this.passwordResetRepository. findValidToken(token);
  }

  /**
   * Restablecer contraseña
   */
  async resetPassword(token, newPassword) {
    // Validar token
    const reset = await this.passwordResetRepository.findValidToken(token);

    // Obtener usuario CON password para comparar
    const user = await this.userRepository.findByEmailWithPassword(
      (await this.userRepository.findById(reset.userId)).email
    );

    // Verificar que la nueva contrasena NO sea igual a la anterior
    const isSamePassword = await bcrypt. compare(newPassword, user.password);
    
    if (isSamePassword) {
      const error = new Error('New password must be different from the current password');
      error.code = 'SAME_PASSWORD';
      throw error;
    }

    // Hashear nueva contrasena
    const hashedPassword = bcrypt.hashSync(newPassword, ROUNDS);

    // Actualizar contrasena
    await this.userDAO.updatePassword(reset.userId, hashedPassword);

    // Marcar token como usado
    await this.passwordResetRepository.markAsUsed(token);

    return { success: true };
  }
}