const createError = require('http-errors');
const express = require('express');
const app = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// TODO: Add the routers here
const admin_router = require("./routes/admin.route");

require('../utils/db.js');

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-auth-token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
  next();
});

app.use(logger('dev'));
app.use(express.json({limit: '16mb'}));
app.use(express.urlencoded({ limit: '16mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('../utils/passport.init');

// TODO: Add the routers' endpoints
app.use('/admins', admin_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end();
});

module.exports = app;