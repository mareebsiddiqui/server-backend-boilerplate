const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const AdminService = require('../v1/services/admin.service');
const { ERRORS } = require('./constants');

const local_strategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function(email, password, done) {
        try {
            
            let admin = await AdminService.find_by_email(email);
            if(!admin) {
                return done(null, false, {error: ERRORS.INVALID_CREDENTIALS});
            } else {
                let is_match = admin.compare_password(password);
                if(!is_match) return done(null, false, {error: ERRORS.INVALID_CREDENTIALS});
                else return done(null, admin);
            }

        } catch(err) {
            return done(err);
        }
    }
)

passport.use(local_strategy);