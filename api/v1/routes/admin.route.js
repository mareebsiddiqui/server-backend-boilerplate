var express = require('express');
var router = express.Router();

const passport = require("passport");

const {ReS, ReE, generate_token, send_token, authenticate, is_super_admin} = require("../../utils/helpers");
const {ERRORS} = require("../../utils/constants");

const AdminService = require("../services/admin.service");

router.get('/', authenticate, async (req, res) => {
  try {
    if(!await AdminService.is_super_admin(req.auth.id)) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let limit = ~~req.query.limit;
      let page = ~~req.query.page;
      let admins = await AdminService.get_all(limit, page);
  
      ReS(res, {
        admins
      });
    }
    
  } catch(err) {
    ReE(res, err);
  }
})

router.post('/', async (req, res, next) => {
  try {
    let is_first_signup = await AdminService.is_first_signup();
    if(!is_first_signup) {
      next();
    }
    else {
      let admin = await AdminService.create(req.body, true);
      ReS(res, {
        admin
      });
    }
  } catch(err) {
    ReE(res, err);
  }
}, authenticate, async (req, res) => {
  try {
    if(!await AdminService.is_super_admin(req.auth.id)) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    let admin = await AdminService.create(req.body);
    
    ReS(res, {
      admin
    });
  } catch(err) {
    ReE(res, err);
  }
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', { session: false }, function(err, user, info) {
    if(err) ReE(res, err, 401);
    else if(info && info.error) ReE(res, info.error, 401);
    else {
      req.auth = {
        id: user.id
      }
      next();
    }
  })(req, res, next);
}, generate_token, send_token);

module.exports = router;
