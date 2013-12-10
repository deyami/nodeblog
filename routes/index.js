var biz = require('../biz');
var Post = require('../orm/post');
var Category = require('../orm/category');
var Link = require('../orm/sharedlink');

//断言用户已经登录，如未登录，重定向至登录页面
var checkLogin = function(req,res,next){
  if((!req.session) || (!req.session.user)){
    console.log('用户还未登录');
    return res.redirect('/login');
  }else{
    next();
  }
};

//断言用户已经登录，如未登录，返回ajax错误信息
var checkAjaxLogin = function(req,res,next){
  if((!req.session) || (!req.session.user)){
    console.log('用户还未登录');
    return res.json(403, { msg: '请先登录' });
  }else{
    next();
  }
};

//断言用户还未登录，如果已登录，重定向至首页
var checkNotLogin = function(req,res,next){
  if((req.session)&&(req.session.user)){
    console.log('用户已经登录');
    return res.redirect('/');
  }else{
    next();
  }
};

//设定路由表
module.exports = function(app){

  app.get('/', function(req, res, next){
    Post.getAll(function(err,posts){

      if(err){
        res.redirect('500');
        return ;
      }
      Link.getAll(function(err,links){
        if(err){
          res.redirect('500');
          return ;
        }
        res.render('index',{posts:posts,links:links});
      });
    });
	});

  app.get('/contact', function(req, res, next){
	 res.render('contact', {layout:false});
	});

  app.get('/login', function(req, res, next){
	 res.render('login', {layout:false});
	});

  app.get('/reg', checkNotLogin);
  app.get('/reg',function(req,res, next){
    res.render('reg',{layout:false})
  });

  app.get('/admin/:page', checkLogin);
  app.get('/admin/:page',function(req,res, next){
    if(req.params.page === 'main'){
        res.render('main',{admintitle:'概况',layout:'admin-layout'});
    }else if(req.params.page === 'new'){
        Category.getAll(function(err,categorys){
          res.render('newpost',{admintitle:'新文章',categorys:categorys,layout:'admin-layout'}); 
        });
    }else if(req.params.page === 'list'){
        Post.getAll(function(err,posts){
          if(err){
            console.log(err);
            res.redirect('/');
            return;
          }
          res.render('admin/list',{admintitle:'所有文章',layout:'admin-layout',posts:posts});
        });  
    }else{
        res.render('404', {  
            status: 404  ,layout:false
        }); 
        return;
    }
  });

  app.get('/admin/edit/:bid', checkLogin);
  app.get('/admin/edit/:bid', function(req,res, next){
    if(!req.params.bid){
      res.redirect('/admin/main');
      return;
    }

    Category.getAll(function(err,categorys){
      if(err){
          console.log(err);
          res.redirect('/');
          return;
      }
      Post.get(req.params.bid,function(err,post){
        if(err){
          console.log(err);
          res.redirect('/');
          return;
        }
        if(!post){
          res.render('404', {  
            status: 404  ,layout:false
          }); 
          return;
        }
        res.render('admin/edit',{admintitle:'编辑',categorys:categorys,post:post,layout:'admin-layout'});
      });  
    });
  });


  app.get('/dologout',biz.logout);
  app.post('/dologin',biz.login);
  app.post('/doreg',biz.register);
  app.post('/post/save', checkAjaxLogin);
  app.post('/post/save',biz.save_post);
  app.get('/post/detail/:bid',biz.get_post_detail);

  app.get('/post/:bid', checkLogin);
  app.get('/post/:bid',biz.get_post_data);

  app.get('/post/delete/:bid', checkLogin);
  app.get('/post/delete/:bid',biz.delete_post);

  app.post('/post/edit', checkLogin);
  app.post('/post/edit',biz.edit_post);


//拦截所有请求，如果走到此处，说明没有页面
  app.get('/*', function(req, res) {   
    res.render('error/404', {  
        status: 404  ,layout:false
    });  
  }) 
};


