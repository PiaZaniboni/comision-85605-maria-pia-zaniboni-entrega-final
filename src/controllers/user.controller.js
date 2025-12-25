import { UserService } from '../services/user.services.js';
import { UserDTO } from '../dto/user.dto.js';

/**
 * Responsabilidad: Manejar req/res, validaciones HTTP, codigos de estado
 */
export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // GET /api/users - Listar todos (solo admin)
  getAll = async (req, res, next) => {
    try {
      const users = await this. userService.getAllUsers();
      const usersDTO = users.map(user => UserDTO.forList(user));
      res.json(usersDTO);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/:id - Obtener por ID
  getById = async (req, res, next) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(UserDTO.fromModel(user));
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      next(err);
    }
  }

  // GET /api/users/me - Obtener usuario actual
  getMe = async (req, res, next) => {
    try {
      if (! req.user?. id) {
        return res. status(400).json({ error: 'Bad Request: No user in session' });
      }

      const user = await this.userService.getUserById(req.user.id);
      res.json(UserDTO.fromModel(user));
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      next(err);
    }
  }

  // POST /api/users - Crear usuario (solo admin)
  create = async (req, res, next) => {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      // Validacion
      if (!first_name || ! last_name || !email || age == null || ! password) {
        return res. status(422).json({ 
          message: 'first_name, last_name, age, email, password are mandatory' 
        });
      }

      const user = await this.userService. createUser(req.body);
      
      res.status(201)
         .location(`/api/users/${user._id}`)
         .json(UserDTO.fromModel(user));
         
    } catch (err) {
      if (err.code === 'EMAIL_EXISTS') {
        return res.status(409).json({ message: 'Email already registered' });
      }
      next(err);
    }
  }

  // PUT /api/users/:id - Actualizar usuario completo (solo admin)
  update = async (req, res, next) => {
    try {
      const { first_name, last_name, email, age } = req.body;

      if (!first_name || !last_name || !email || age == null) {
        return res.status(422).json({ 
          message: 'first_name, last_name, age, email are mandatory' 
        });
      }

      const updated = await this.userService.updateUser(req.params.id, req.body);
      res.json(UserDTO.fromModel(updated));
      
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      next(err);
    }
  }

  // PATCH /api/users/:id - Actualizar parcial (solo admin)
  partialUpdate = async (req, res, next) => {
    try {
      const allowed = ['first_name', 'last_name', 'age', 'email', 'cart', 'role'];
      const $set = Object.fromEntries(
        Object.entries(req.body || {}).filter(([key]) => allowed.includes(key))
      );

      const updated = await this.userService.updateUser(req.params.id, $set);
      res.json(UserDTO.fromModel(updated));
      
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      next(err);
    }
  }

  // DELETE /api/users/: id - Eliminar (solo admin)
  delete = async (req, res, next) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      next(err);
    }
  }
}