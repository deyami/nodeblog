var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var favicon = require('serve-favicon');
var errorhandler = require('errorhandler');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');
var routes = require('./controller/controller');
var http = require('http');
var path = require('path');
var setting = require('./setting');
var filter = require('./controller/filter');
//var RedisStore = require('connect-redis')(express);
var dbsetting = require('./model/dbsetting');

var app = express();

app.set('port', process.env.PORT || setting.port);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser());
app.use(cookieParser());
//app.use(session({store: new RedisStore(dbsetting.redis), secret: setting.sessionsecret}));
app.use(methodOverride());
app.use(errorhandler());



//app.use(filter.errorHandler);
app.use(filter.sessionHandler);
routes(app);//执行路由
app.locals.title = setting.title;
app.locals.subtitle = setting.subtitle;

http.createServer(app).listen(app.get('port'), function () {
    console.log("server listening on port " + app.get('port'));
});
