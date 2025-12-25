/**
 * Responsabilidad: Transformar datos del modelo a formato seguro para enviar al cliente
 * NUNCA incluye informacion sensible como passwords
 */
export class UserDTO {
  
  static fromModel(user) {
    return {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart || null
    };
  }

  // DTO para /current 
  static forCurrent(user) {
    return {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name:  user.last_name,
      email: user.email,
      role: user.role
    };
  }

  // para listas
  static forList(user) {
    return {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    };
  }
}