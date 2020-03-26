var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var usersRouter = require('./routes/controller/user/index');
let sessionParser = require('express-session');
let FileStore = require('session-file-store')(sessionParser); // 1

var app = express();
app.use(cookieParser());

app.use(sessionParser({
  key: 'sid',
  secret: 'youngjun',
  resave: false,
  saveUninitialized: true,
  store: new FileStore(),
  cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }

}));
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'public/images', 'icon.ico')));
app.use(express.static('public'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// app.use('/', indexRouter);

app.use('/', usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;