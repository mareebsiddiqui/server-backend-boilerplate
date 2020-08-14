const { Admin } = require("../../models");

const UserRoleService = require("./user_role.service");

class AdminService extends UserRoleService {
    constructor() {
        super(Admin);
    }
}

module.exports = new AdminService();