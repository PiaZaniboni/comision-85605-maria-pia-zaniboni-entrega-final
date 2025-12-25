import { UserRepository } from '../repositories/user.repository.js';

/**
 * Responsabilidad:  Logica de negocio
 */
export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData) {
    // Normalizar email
    const normEmail = String(userData.email).toLowerCase().trim();

    // Logica de negocio:  detectar si es admin por el email
    const isAdmin = normEmail.includes('admin');

    // Crear usuario
    const user = await this.userRepository.create({
      ... userData,
      email: normEmail,
      role:  isAdmin ? 'admin' :  (userData.role || 'user'),
      cart: userData.cart || null
    });

    return user;
  }

  async getUserById(id) {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async updateUser(id, updateData) {
    // No actualizar el password aca
    const { password, ...safeData } = updateData;
    
    return await this.userRepository. update(id, safeData);
  }

  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }
}