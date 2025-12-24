import { userModel } from '../models/user.model.js';

export default class UserDao {
    async getUsers() {
        return await userModel.find();
    }
    async getUserById(id) {
        return await userModel.findById(id);
    }
    async createUser(userData) {
        return await new userModel.create(userData);
    }
}
