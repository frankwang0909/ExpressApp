// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

module.exports = function(app) {
	app.get('/',function(req,res) {
	    res.render('index', {title:'Home Page'});
	});

	app.get('/about',function(req,res) {
	    res.send('Hello World!');
	});

	// 注册页路由
	app.get('/reg',function(req,res) {
	    res.render('reg', {title:'注册'});
	});
	app.post('/reg',function(req,res) {
	    
	});
	//登录页路由
	app.get('/login',function(req,res) {
	    res.render('login', {title:'登录'});
	});
	app.post('/login',function(req,res) {
	    
	});
	//发表页路由
	app.get('/post',function(req,res) {
	   res.render('post', {title:'发表'});
	});
	app.post('/post',function(req,res) {
	    
	});
	//登出路由
	app.get('/logout',function(req,res) {
	    
	});


};


