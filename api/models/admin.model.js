const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { MODEL, COLLECTION, ERRORS, REGEX, SALT_WORK_FACTOR } = require("../utils/constants");

let admin_schema = new mongoose.Schema({
    email: {
        type: String,
        validate: {
            validator: (v) => REGEX.EMAIL.test(v),
            message: props => `${ERRORS.INVALID_EMAIL}: ${props.value}`
        },
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_super_admin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

admin_schema.pre('save', function(next) {
    var admin = this;

    // only hash the password if it has been modified (or is new)
    if (!admin.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(admin.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            admin.password = hash;
            next();
        });
    });
});

admin_schema.methods.compare_password = function (candidate_password) {
    return bcrypt.compareSync(candidate_password, this.password);
};

let Admin = mongoose.model(MODEL.ADMIN, admin_schema, COLLECTION.ADMINS);

module.exports = { Admin };