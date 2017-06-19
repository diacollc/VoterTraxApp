var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//added
var om = require('./routes/om');
var precinct = require('./routes/precinct');
var votermap = require('./routes/votermap');
var voterdetails = require('./routes/lookupvoterdetail.js');

//added
var xmlparser = require('express-xml-bodyparser');
var socket_io = require( "socket.io" );

var app = express();

//socket.io
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make io accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();
});

app.use('/', routes);
app.use('/users', users);

//added
app.use('/precinct', precinct);
app.use('/votermap', votermap);
app.use('/lookupdetail', voterdetails);
app.use('/om', xmlparser({ trim: false, explicitArray: false }), om);

// socket.io events
io.on( "connection", function( socket )
{
    console.log( "A user connected" );
});


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
