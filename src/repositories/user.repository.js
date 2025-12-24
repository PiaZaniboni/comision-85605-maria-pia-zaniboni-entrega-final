export default class UserRepository {   

    constructor(userDao) {
        this.userDao = userDao
    }

    getByEmail(email) {
        return this.userDao.getByEmail(email)
    }

    getById(id) {
        return this.userDao.getById(id)
    }

    create(userData) {
        return this.userDao.create(userData)
    }

}  