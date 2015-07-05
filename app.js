var express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	port = process.env.PORT || 3000,
	// express 4.X不再包含以下中间件 具体看https://github.com/senchalabs/connect#middleware
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	// session中间件不在内置express，所以需要安装session并且调用方式也有变
	mongoStore = require('connect-mongo')(session),
	dbUrl = 'mongodb://localhost/imooc',
	app = express();

mongoose.connect(dbUrl);
// 设置视图文件路径
app.set('views', './views/pages');
// 设置视图引擎
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
	name: "imooc",
	secret: "imooc",
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({
		url: dbUrl,
		// auto_reconnect: true,//issue 推荐解决方法
		collection: "sessions"
	})
}));

if("development" === app.get("env")){ //只用于开发环境
	app.set("showStackError",true);
	app.use(logger(":method :url :status"));
	app.locals.pretty = true;
	mongoose.set("debug",true);
}

require("./config/routes")(app);
app.use(express.static(path.join(__dirname, '/public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started on port ' + port);

