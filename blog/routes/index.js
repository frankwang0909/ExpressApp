
//crypto 是 Node.js 的一个核心模块，我们用它生成散列值来加密密码
var crypto = require('crypto'); 
var User = require('../models/user.js');
var Post = require('../models/post.js');

module.exports = function(app) {
	app.get('/',function(req,res) {
		Post.get(null, function(err, posts) {
			if (err) {
				posts = [];
			}
			res.render('index',{
		    	title: '主页',
		    	user: req.session.user,
		    	posts: posts,
		    	success: req.flash('success').toString(),
		    	error: req.flash('error').toString()
		    });
		})
	});

	// 注册页路由
	app.get('/reg', checkNotLogin);  //检查是否为未登录。
	app.get('/reg',function(req,res) {
	    // res.render('reg', {title:'注册'});
	    res.render('reg', {
		    title: '注册',
		    user: req.session.user,
		    success: req.flash('success').toString(),
		    error: req.flash('error').toString()
		  });
	});

	app.post('/reg', checkNotLogin);
	app.post('/reg',function(req,res) {
	    var name = req.body.name, //表单内 name="name"的值
	    	password = req.body.password, //表单内 name="passsword"的值
	    	password_re = req.body['password_rep'], //表单内 name="passsword"的值
	    	email = req.body.email;
	    // 检验用户两次输入的密码是否一致
	    if (password_re !== password) {
	    	req.flash('error', '两次输入的密码不一致！');
	    	return res.redirect('/reg'); //返回注册页
	    }
	    //生成密码的md5值
	    var md5 = crypto.createHash('md5'),
	    	password = md5.update(req.body.password).digest('hex');
	    //创建用户，并存储信息。
	    var newUser = new User({
	    	name: name,
	    	password: password,
	    	email: email
	    });
	    // 检查用户名是否已经存在
	    User.get(newUser.name, function(err,user) {
	    	if (err) {
	    		req.flash('error', err);
	    		return res.redirect('/');
	    	}
	    	if (user) {
	    		req.flash('error', '用户已存在');
	    		return res.redirect('/reg'); 
	    	}
	    	//如果用户不存在，则新增用户
	    	newUser.save(function(err, user) {
	    		if (err) {
	    			req.flash('error', err);
	    			return res.redirect('/reg'); //注册失败返回注册页
	    		}
	    		req.session.user = newUser; //用户信息存入session, 以后就可以通过 req.session.user 读取用户信息。
	    		req.flash('success', '注册成功');
	    		res.redirect('/'); //注册成功后返回主页
	    	});
	    });
	});

	//登录页路由
	app.get('/login', checkNotLogin);
	app.get('/login',function(req,res) {
	    // res.render('login', {title:'登录'});
	    res.render('login',{
	    	title: '登录',
	    	user: req.session.user,
	    	success: req.flash('success').toString(),
	    	error: req.flash('error').toString(),
	    });
	});

	app.post('/login', checkNotLogin);
	app.post('/login',function(req,res) {
	    // 生成密码的md5值
	    var md5 = crypto.createHash('md5'),
	    	password = md5.update(req.body.password).digest('hex');
	    // 检查用户是否存在
	    User.get(req.body.name, function(err, user){
	    	if (!user) {
	    		req.flash('error', '用户不存在');
	    		return res.redirect('/login'); 
	    	}
	    	// 检查密码是正确
	    	if (user.password != password) {
	    		req.flash('error', '密码错误');
	    		return res.redirect('/login');
	    	}
	    	// 用户名和密码都匹配后，将用户信息存入session
	    	req.session.user = user;
	    	req.flash('success', '登录成功');
	    	res.redirect('/'); //登陆成功后跳转到主页
	    });
	});

	//发表页路由
	app.get('/post', checkLogin); //检查是否已登录
	app.get('/post',function(req,res) {
	   res.render('post', {
	   	title:'发表',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	   });
	});

	app.post('/post', checkLogin);
	app.post('/post',function(req,res) {
	    var currentUser = req.session.user,
	        post = new Post(currentUser.name, req.body.title, req.body.post);

	    post.save(function(err) {
	    	if (err) {
	    		req.flash('error', err);
	    		return res.redirect('/');
	    	}
	    	req.flash('success', '发布成功');
	    	res.redirect('/');
	    })
	});

	//登出路由
	app.get('/logout',function(req,res) {
	    req.session.user = null;
	    req.flash('success', '登出成功');
	    res.redirect('/'); //登出成功后跳转到主页
	});

	function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录');
			res.redirect('back');
		}
		next();
	}

	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录');
			res.redirect('/login');
		}
		next();
	}
};


