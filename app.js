//import neede modules
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//import the routes file
var routes = require('./routes/index');

//setup the database
var mongoose = require('mongoose');
var dbconfig = require('./models/config');
mongoose.Promise = require('bluebird');
mongoose.connect(dbconfig.url);

//setup the session storage in MongoDB database
const MongoStore = require('connect-mongo')(session);

//import the user model to use passport
var User = require('./models/user').User;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session setup
app.use(session({
  secret: 'Test session for upwork',
  store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 1800 }),
  resave: true,
  saveUninitialized: true 
}));

//configure passport
passport.use(new localStrategy(function(username, password, cb) {
    User.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (!user.compare(password)){
        return cb(null, false);
      }
      return cb(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  console.log('serialize user: ' + user.id)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  console.log('deserialize user')
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, {id: user._id});
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
