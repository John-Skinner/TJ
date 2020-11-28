import {PeopleQueue} from "../src/PeopleQueue";
import {Store} from "../src/Store";
import {CustomerSocket} from "../src/CustomerSocket";
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

const WebSocket = require('ws');
var associateConnection: any;
var associateWsServer: any;
export var readyToCommunicate: boolean = false;
var customerConnection: any;
var customerWsServer: any;
var customerSockets: CustomerSocket[] = [];


function InitServices() {
  associateWsServer = new WebSocket.Server({
    port: 3080
  });
  associateWsServer.on('connection', (socket: any) => {
    associateConnection = socket;
    readyToCommunicate = true;
    socket.on('message', (msg:string) =>
        console.log(' message received for assoc socket'));
    socket.on('close', () => {
      console.log(' closing associate connection.');
      readyToCommunicate = false;
    })
  });
  customerWsServer = new WebSocket.Server({
    port: 3090
  });
  customerWsServer.on('connection',(socket: any) =>
  {
    let cs = new CustomerSocket(socket);
    customerSockets.push(cs);
    cs.registerForSocketEvents();
  })

}
export function updateQueue(group:string)
{
  console.log(" start update queue to all");
  customerSockets.forEach(cs =>
  {
    if (cs.podName !== group)
    {
      cs.notify();
    }
    else
    {
      console.log('successfully skipped notifying itself:' + group);
    }
  });
  associateConnection.send('update');
  console.log(" trigger update queue");

}


InitServices();


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
