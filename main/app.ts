import {PeopleQueue} from "../src/PeopleQueue";
import {Store} from "../src/Store";
export {StoreQueueGlobal}
export {StoreGlobal}


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('../routes');


var app = express();
var StoreQueueGlobal = new PeopleQueue();
var StoreGlobal = new Store();


// view engine setup
app.set('views', path.join("./", 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/public',express.static(path.join(process.cwd(), 'public/javascripts')));
console.log(path.join(process.cwd(),'public/javascripts'));

app.use('/', indexRouter);


// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
