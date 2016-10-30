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
1.作用：
在 MVC 架构中，模板引擎包含在服务器端。控制器得到用户请求后，从模型获取数据，调用模板引擎。模板引擎以数据和页面模板为输入，生成 HTML 页面，然后返回给控制器，由控制器交回客户端。

2.ejs 的标签系统非常简单，它只有以下三种标签：
	
	<% code %>：JavaScript 代码。
	<%= code %>：显示替换过 HTML 特殊字符的内容。
	<%- code %>：显示原始 HTML 内容。

3.示例：
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

4.页面布局：include引用其他模板文件
假设我们有header.ejs和footer.ejs, index.ejs引入这两个文件
	
	<%- include header %>
	<div class="main">
		这里是中间区域
	</div>
	<%- include footer %>

### 路由规划
博客网站有如下功能：注册、登录、发表、退出，相应地有注册页、登录页、发表页。
根据设计，规划如下路由：
	/ ：首页
	/login ：用户登录
	/reg ：用户注册
	/post ：发表文章
	/logout ：登出

 /login 和  /reg 只能是未登录的用户访问，而  /post 和  /logout 只能是已登录的用户访问。左侧导航列表则针对已登录和未登录的用户显示不同的内容。

修改routes目录下的index.js：

	module.exports = function(app) {
	  app.get('/', function (req, res) {
	    res.render('index', { title: '主页' });
	  });
	  app.get('/reg', function (req, res) {
	    res.render('reg', { title: '注册' });
	  });
	  app.post('/reg', function (req, res) {
	  });
	  app.get('/login', function (req, res) {
	    res.render('login', { title: '登录' });
	  });
	  app.post('/login', function (req, res) {
	  });
	  app.get('/post', function (req, res) {
	    res.render('post', { title: '发表' });
	  });
	  app.post('/post', function (req, res) {
	  });
	  app.get('/logout', function (req, res) {
	  });
	};

### 数据库 MongoDB
如何判断用户是否已经登陆了，需要用到会话（session）机制来记录用户登录状态。这时候我们还需要访问数据库来保存和读取用户信息。

#### MongoDB的基本知识：
1. 基于分布式文件存储的 NoSQL（非关系型数据库）的一种，由 C++ 语言编写，旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
2. MongoDB 支持的数据结构非常松散，是类似 json 的 bjson 格式，因此可以存储比较复杂的数据类型。
3. 文档是 MongoDB 最基本的单位，每个文档都会以唯一的 _id 标识，文档的属性为 key/value 的键值对形式，文档内可以嵌套另一个文档，因此可以存储比较复杂的数据类型。
4. 集合是许多文档的总和，一个数据库可以有多个集合，一个集合可以有多个文档。

#### 安装及配置
1. 下载：
	[官网下载]（https://www.mongodb.com/download-center#community）

2. 安装：
	默认路径是：C:\Program Files\MongoDB\Server\3.2\;
	可以改成 D:\Program Files\MongoDB\Server\3.2\。

3. 配置：
	先在安装目录下新建目录blog，用于存放项目的数据；
	设置数据路径：命令行切换到D:\Program Files\MongoDB\Server\3.2\bin\
	再输入 mongod.exe --dbpath "D:\Program Files\MongoDB\Server\3.2\blog"

	命令行出现一大串字符,最后有一行显示“waiting for connections on port 27017” 说明MongoDB连接成功了，在浏览器打开"localhost:27017",会显示一行“It looks like you are trying to access MongoDB over HTTP on the native driver port.”


#### 启动
每次运行项目（npm start)之前需要启动数据库, 否则会报错显示：
`MongoError: failed to connect to server [localhost:27017] on first connect.`
命令行切换到`D:\Program Files\MongoDB\Server\3.2\bin\`
再输入`mongod.exe --dbpath "D:\Program Files\MongoDB\Server\3.2\blog" `即可启动数据库。


#### 连接MongoDB
Node.js中需要mongodb驱动模块来使用MongoDB
命令行切换到项目根目录下F:\LEARN\Express\ExpressApp\blog
	$ npm install mongodb


示例代码：
	var MongoClient = require('mongodb').MongoClient;

	MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
	  if (err) {
	    throw err;
	  }
	  db.collection('mammals').find().toArray(function(err, result) {
	    if (err) {
	      throw err;
	    }
	    console.log(result);
	  });
	});

### 查看数据库内容
命令行切换到MongoDB安装目录的bin目录，如D:\Program Files\MongoDB\Server\3.2\bin
输入： mongo
<!-- 进入到命名为blog的数据库下 -->
再输入： use blog  
<!-- 找到所有的user信息 -->
输入： db.users.find()

### 页面通知
1. 什么是flash: 
flash 是一个在 session 中用于存储信息的特定区域。信息写入 flash ，下一次显示完毕后即被清除。典型的应用是结合重定向的功能，确保信息是提供给下一个被渲染的页面。
2. 安装connect-flash 模块：npm install connect-flash --save
3. 修改 app.js 在  var settings = require('./settings'); 后添加：
	var flash = require('connect-flash');
在 app.set('view engine', 'ejs'); 后添加：
	app.use(flash());
现在我们就可以使用 flash 功能了。

### 页面权限控制
注册和登陆页面应该阻止已登陆的用户访问，登出及后面我们将要实现的发表页只对已登录的用户开放。把用户登录状态的检查放到路由中间件中，在每个路径前增加路由中间件，即可实现页面权限控制。添加 checkNotLogin 和  checkLogin 函数来实现这个功能。

	function checkLogin(req, res, next) {
	  if (!req.session.user) {
	    req.flash('error', '未登录!'); 
	    res.redirect('/login');
	  }
	  next();
	}

	function checkNotLogin(req, res, next) {
	  if (req.session.user) {
	    req.flash('error', '已登录!'); 
	    res.redirect('back');//返回之前的页面
	  }
	  next();
	}
