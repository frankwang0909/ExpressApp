<!-- 用Express框架快速搭建博客 -->

## 搭建环境
### 开发环境
1.Node.js: 4.5.0;
2.Express: 4.13.4;
3.MongoDB: 3.2.10;

### 安装 express 命令行工具
$ npm install -g express-generator

### 新建工程
$ express -e blog

### 安装所需模块
$ cd blog && npm install

### 启动服务,默认监听3000端口。
$ npm start

### 打开浏览器，访问localhost:3000

## 了解工程结构及初始化代码
### 工程的目录结构：
1. app.js: 入口文件
2. package.json: 工程信息及模块依赖
3. node_modules: 存放package.json中依赖的node模块
4. public: 存放image、css、js等静态文件
5. routes: 存放路由文件
6. views: 存放视图文件/模板文件
7. bin: 存放可执行文件

### 代码含义
#### （一）入口文件 app.js
##### 使用require()加载依赖的模块
	var express = require('express');
	var path = require('path');
	var favicon = require('serve-favicon');
	var logger = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	<!-- 加载路由文件-->
	var routes = require('./routes/index');
	var users = require('./routes/users');

##### 实例化
	var app = express();

##### 设置视图存放文件目录
	app.set('views', path.join(__dirname, 'views'));
	<!-- __dirname为全局变量，存储当前正在执行的脚本所在的目录 -->

##### 设置视图模板为EJS
	app.set('view engine', 'ejs');

##### 设置icon图标
	app.use(favicon(__dirname + '/public/favicon.ico'));

##### 加载日志中间件
	app.use(logger('dev'));

##### 加载解析json的中间件
	app.use(bodyParser.json());

##### 加载解析urlencoded请求体的中间件
	app.use(bodyParser.urlencoded({extended:false}));

##### 加载解析cookie的中间件
	app.use(cookieParser());

##### 设置public文件夹为存放静态文件的目录
	app.use(express.static(path.join(__dirname, 'public')));

##### 设置路由控制
	app.use('/', routes);
	app.use('/users', users);

##### 捕获404错误，并处理
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

##### 开发环境下的错误处理, 将错误信息渲染error模版并显示到浏览器中
	if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
	  });
	}

##### 生产环境下的错误处理
	app.use(function(err, req, res, next){
		res.status(err.status || 500);
		res.render('error',{
			message: err.message,
			error:{}
		})
	});

##### 导出app实例供其他模块调用
	module.exports = app;


#### (二) routes/index.js 路由文件
##### 加载模块
	var express = require('express');
	var router = express.Router();

##### 设置首页的路由
渲染views/index.ejs模块，传入了一个变量 title 值为 express 字符串 
	router.get('/', function(req, res) {
	  res.render('index', { title: 'Express' });
	});


#### (三) views/index.ejs 首页模板文件
	<!DOCTYPE html>
	<html>
	  <head>
	    <title><%= title %></title>
	    <link rel='stylesheet' href='/stylesheets/style.css' />
	  </head>
	  <body>
	    <h1><%= title %></h1>
	    <p>Welcome to <%= title %></p>
	  </body>
	</html>


### 模板引擎
1. 作用：
在 MVC 架构中，模板引擎包含在服务器端。控制器得到用户请求后，从模型获取数据，调用模板引擎。模板引擎以数据和页面模板为输入，生成 HTML 页面，然后返回给控制器，由控制器交回客户端。

2. ejs 的标签系统非常简单，它只有以下三种标签：
	<% code %>：JavaScript 代码。
	<%= code %>：显示替换过 HTML 特殊字符的内容。
	<%- code %>：显示原始 HTML 内容。

3. 示例：
数据：
	students: ['Alex', 'Bob', 'Callie']

模板：
	<ul>
	<% for(var i=0; i<students.length; i++) {%>
	   <li><%= students[i] %></li>
	<% } %>
	</ul>

渲染结果：
	<ul>
	  <li>Alex</li>
	  <li>Bob</li>
	  <li>Callie</li>
	</ul>

4. 页面布局：include引用其他模板文件
假设我们有header.ejs和footer.ejs, index.ejs引入这两个文件
	<%- include header %>
	<div class="main">
		这里是中间区域
	</div>
	<%- include footer %>
