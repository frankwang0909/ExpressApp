var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
// var users = require('./routes/users');
var settings = require('./settings');

var flash = require('connect-flash');

// 会话用来识别用户
var session = require('express-session');
// 将会话信息存储值数据库中
var MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: settings.cookieSecret, //secret 用来防止篡改 cookie
  key: settings.db, //key 的值为 cookie 的名字
  cookie: {  //maxAge 值设定 cookie 的生存期
    maxAge: 1000*60*60*24*30 //30 days对应的毫秒数
  },
  store: new MongoStore({ //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失
    // db: settings.db,
    // host:settings.host,
    // port:settings.port,
    url: 'mongodb://localhost/blog'
  })
}));
// app.use('/', routes);
// app.use('/users', users);
routes(app);

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
