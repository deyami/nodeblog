var Q = require('q');
var biz = require('../biz');
var Post = require('../orm/post');
var Category = require('../orm/category');
var Link = require('../orm/sharedlink');

//断言用户已经登录，如未登录，重定向至登录页面
var checkLogin = function (req, res, next) {
    if ((!req.session) || (!req.session.user)) {
        console.log('用户还未登录');
        return res.redirect('/login');
    } else {
        next();
    }
};

//断言用户已经登录，如未登录，返回ajax错误信息
var checkAjaxLogin = function (req, res, next) {
    if ((!req.session) || (!req.session.user)) {
        console.log('用户还未登录');
        return res.json(403, {msg: '请先登录'});
    } else {
        next();
    }
};

//断言用户还未登录，如果已登录，重定向至首页
var checkNotLogin = function (req, res, next) {
    if ((req.session) && (req.session.user)) {
        console.log('用户已经登录');
        return res.redirect('/');
    } else {
        next();
    }
};

//设定路由表
module.exports = function (router) {
    router.get('/', function (req, res, next) {
            console.log("run index");
            var result = {};
            Post.getAll().then(
                function (post) {
                    result["posts"] = post;
                    return Link.getAll();
                }).then(function (links) {
                    result["links"] = links;
                    res.render('index', result);
                }).catch(function (err) {
                    if (err) {
                        res.redirect('500');
                        return;
                    }
                });
        }
    );

    router.get('/contact', function (req, res, next) {
        console.log("run");
        res.render('contact', {layout: false});
    });

    router.get('/login', function (req, res, next) {
        res.render('login', {layout: false});
    });

    router.get('/reg', checkNotLogin);
    router.get('/reg', function (req, res, next) {
        res.render('reg', {layout: false})
    });

    router.get('/admin/:page', checkLogin);
    router.get('/admin/:page', function (req, res, next) {
        if (req.params.page === 'main') {
            res.render('main', {admintitle: '概况', layout: 'admin-layout'});
        } else if (req.params.page === 'new') {
            Category.getAll()
                .then(function (categorys) {
                    res.render('newpost', {admintitle: '新文章', categorys: categorys, layout: 'admin-layout'});
                }).catch(function (err) {
                    console.log(err);
                    res.redirect('/');
                });
        } else if (req.params.page === 'list') {
            Post.getAll()
                .then(function (posts) {
                    res.render('admin/list', {admintitle: '所有文章', layout: 'admin-layout', posts: posts});
                }).catch(function (err) {
                    console.log(err);
                    res.redirect('/');
                });
        } else {
            res.render('404', {
                status: 404, layout: false
            });
            return;
        }
    });

    router.get('/admin/edit/:bid', checkLogin);
    router.get('/admin/edit/:bid', function (req, res, next) {
        if (!req.params.bid) {
            res.redirect('/admin/main');
            return;
        }

        var result = {};
        Category.getAll().then(function (categorys) {
            result['categorys'] = categorys;
            return Post.get(req.params.bid);
        }).then(function (post) {
            if (!post) {
                res.render('404', {
                    status: 404, layout: false
                });
                return;
            } else {
                result['post'] = post;
                result['admintitle'] = '编辑';
                result['layout'] = 'admin-layout';
                res.render('admin/edit', result);
            }
        }).catch(function (err) {
            console.log(err);
            res.redirect('/');
        });
    });


    router.get('/dologout', biz.logout);
    router.post('/dologin', biz.login);
    router.post('/doreg', biz.register);
    router.post('/post/save', checkAjaxLogin);
    router.post('/post/save', biz.save_post);
    router.get('/post/detail/:bid', biz.get_post_detail);

    router.get('/post/:bid', checkLogin);
    router.get('/post/:bid', biz.get_post_data);

    router.get('/post/delete/:bid', checkLogin);
    router.get('/post/delete/:bid', biz.delete_post);

    router.post('/post/edit', checkLogin);
    router.post('/post/edit', biz.edit_post);


//拦截所有请求，如果走到此处，说明没有页面
    router.get('/*', function (req, res) {
        res.render('error/404', {
            status: 404, layout: false
        });
    })
}
;



