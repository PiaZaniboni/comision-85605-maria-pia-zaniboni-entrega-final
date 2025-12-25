import { UserDAO } from '../dao/user.dao.js';

/**
 * Responsabilidad: Logica de acceso a datos + validaciones de datos
 */
export class UserRepository {
  constructor() {
    this.userDAO = new UserDAO();
  }

  async create(userData) {
    // Verificar si el email ya existe
    const exists = await this.userDAO.findByEmail(userData.email);
    if (exists) {
      const error = new Error('Email already registered');
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    return await this.userDAO.create(userData);
  }

  async findByEmail(email) {
    return await this.userDAO. findByEmail(email);
  }

  async findById(id) {
    const user = await this.userDAO. findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return user;
  }

  async findAll() {
    return await this.userDAO. findAll();
  }

  async update(id, updateData) {
    const updated = await this.userDAO.update(id, updateData);
    if (!updated) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return updated;
  }

  async delete(id) {
    const deleted = await this. userDAO.delete(id);
    if (!deleted) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return deleted;
  }

  //autenticacion
  async findByEmailWithPassword(email) {
    return await this.userDAO.findByEmailWithPassword(email);
  }
}