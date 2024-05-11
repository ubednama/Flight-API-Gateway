const {User} = require("../models");
const CrudRepository = require("./crud.repository");

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(email) {
        return await User.findOne({where: {email: email}})
    }
}

module.exports = UserRepository;