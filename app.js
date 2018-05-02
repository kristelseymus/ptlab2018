var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var moment = require('moment');

require('./models/Users');
require('./models/Reservaties');
require('./models/EventType');
require('./models/Ruimtes');
require('./models/Events');
require('./models/BlockedDates');
require('./models/Content')
require('./config/passport');

moment.locale('nl');

//mongoose.connect('mongodb://admin:admin@ds119548.mlab.com:19548/gamingnews');
/* Connect to mongo database */
mongoose.connect('mongodb://localhost/ptlab', {
   useMongoClient: true
 }, function (err, db) {
   if (!err) {
     console.log('Connected!');
   } else {
     console.dir(err); //failed to connect
   }
 });


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/configuration', express.static(__dirname + '/config'));

app.use(passport.initialize());

app.use('/', routes);
app.use('/api/users', users);

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
