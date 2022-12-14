var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("./models/connection");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var guidesRouter = require('./routes/guide');
var investmentRouter = require('./routes/investment');
var operationRouter = require('./routes/operation');
const cors = require('cors')
var app = express();

// Default values
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Méthode de la manière d'écrire des logs pour l'application
app.use(logger('dev'));
app.use(express.json()); // JavascriptObjectNotation default for all routes
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'reactapp/build')));
app.use(cors())
app.use('/', indexRouter);

// Import des models
app.use('/users', usersRouter);
app.use('/guide', guidesRouter);
app.use('/investment', investmentRouter);
app.use('/operation', operationRouter);

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
  res.render('error');
});

module.exports = app;
