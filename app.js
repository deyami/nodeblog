var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var favicon = require('serve-favicon');
var errorhandler = require('errorhandler');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var setting = require('./setting');
var middleware = require('./middleware');
var RedisStore = require('connect-redis')(express);
var dbsetting = require('./orm/dbsetting');

var app = express();

    app.use(partials());
    app.set('port', process.env.PORT || setting.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(favicon());
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(cookieParser());
    app.use(session({store: new RedisStore(dbsetting.redis), secret: setting.sessionsecret}));
    app.use(methodOverride());
    app.use(errorhandler());
    app.use(serveStatic(path.join(__dirname, 'public')));


routes(app);//执行路由

http.createServer(app).listen(app.get('port'), function () {
    console.log("server listening on port " + app.get('port'));
});
