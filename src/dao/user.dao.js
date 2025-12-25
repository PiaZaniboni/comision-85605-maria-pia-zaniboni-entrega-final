import { User } from '../models/User.model.js';

/**
 * Responsabilidad: Acceso directo a la base de datos
 */
export class UserDAO {
  
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async findById(id) {
    return await User. findById(id).lean();
  }

  async findAll() {
    return await User. find().select('first_name last_name email role age').lean();
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('first_name last_name email role age').lean();
  }

  async delete(id) {
    return await User.findByIdAndDelete(id).lean();
  }

  //autenticacion
  async findByEmailWithPassword(email) {
    return await User.findOne({ email }); 
  }

  async updatePassword(id, hashedPassword) {
    return await User.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true }
    ).select('_id email').lean();
}
}