const { Admin } = require("../../models");

const { TE } = require("../../utils/helpers");
const { ERRORS } = require("../../utils/constants");

class AdminService {
    async find_by_email(email) {
        try {
            let admin = await Admin.findOne({ email });
            return admin;
        } catch(err) {
            TE(err);
        }
    }

    async find_by_id(id) {
        try {
            let admin = await Admin.findById(id);
            return admin;
        } catch(err) {
            TE(err);
        }
    }

    async is_first_signup() {
        try {
            let count_admin = await Admin.find().countDocuments();
            return count_admin == 0;
        } catch(err) {
            TE(err);
        }
    }

    async create(admin_obj, is_first_signup=false) {
        try {
            let admin = new Admin(admin_obj);
            
            if(is_first_signup) admin.is_super_admin = true;
            await admin.save();
            
            return admin;
        } catch(err) {
            TE(err);
        }
    }

    async is_super_admin(id) {
        try {
            let admin = await this.find_by_id(id);
            return admin !== null && admin.is_super_admin;
        } catch(err) {
            TE(err);
        }
    }

    async get_all(limit=10, page=1) {
        try {
            if(!limit) limit = 10;
            if(!page) page = 1;
            let admins = await Admin.find().skip((page-1)*limit).limit(limit).select('-password');
            return admins;
        } catch(err) {
            TE(err);
        }
    }
}

module.exports = new AdminService();