var express = require('express');
var partials = require('express-partials');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var setting  = require('./setting');
var middleware  = require('./middleware');
var RedisStore = require('connect-redis')(express);
var dbsetting  = require('./orm/dbsetting');

var app = express();

app.configure(function(){
  app.use(partials());
  app.set('port', process.env.PORT || setting.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({store: new RedisStore(dbsetting.redis), secret: setting.sessionsecret}));
  app.use(express.methodOverride());
  app.use(middleware.sessionHandler);
  app.use(app.router);  
  app.use(middleware.errorHandler);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

routes(app);//执行路由

http.createServer(app).listen(app.get('port'), function(){
  console.log("server listening on port " + app.get('port'));
});
