var crypto = require('crypto');
var User = require('./model/user');
var Post = require('./model/post');
var Category = require('./model/category');
var Link = require('./model/sharedlink');

var md5 = function (ps) {
    var md5 = crypto.createHash('md5');
    var pswd = md5.update(ps);
    pswd = md5.digest('base64');
    return pswd;
};

var setsession = function (req, user, remeberme) {
    if (req.session) {
        console.log(req.session);
        req.session.user = user;
        if (remeberme) {
            var hour = 3600000;
            req.session.cookie.maxAge = hour;
        }
    }
};

module.exports = {
    register: function (req, res, next) {
        var error = '';
        if (!req.body['username']) {
            error = '用户名不能为空';
        }
        if (!req.body['password']) {
            error = '密码不能为空';
        }
        if (req.body['password'] != req.body['repassword']) {
            error = '密码不一致';
        }
        if (error) {
            console.log(error);
            return next(err);
        }

        var username = req.body['username'];
        var pswd = md5(req.body['password']);

        User.get(req.body['username'], function (err, user) {
            var error = '';
            if (err) {
                error = '注册发生错误';
            }
            if (user) {
                error = '用户已经存在';
            }
            if (error) {
                console.log(error);
                return next(err);
            }

            user = new User({
                username: username,
                password: pswd
            });

            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                setsession(req, user);
                res.redirect('/');
            });
        });
    },

    login: function (req, res, next) {
        if (!req.body['username']) {
            res.locals.error = '用户名不能为空';
        }
        if (!req.body['password']) {
            res.locals.error = '密码不能为空';
        }

        var username = req.body['username'];
        var pswd = md5(req.body['password']);
        var remeberme = req.body['password'];

        User.get(req.body['username'], function (err, user) {
            if (!user) {
                err = '用户不存在';
            } else if (user.password != pswd) {
                err = '密码错误';
            } else if (err) {
                err = '登录出错';
            }

            if (err) {
                res.locals.error = err;
                console.log(err);
                return next(err);
            }

            setsession(req, user, remeberme);
            return res.redirect('/');
        });
    },

    logout: function (req, res, next) {
        req.session.user = null;
        res.redirect('/');
    },

    get_post_data: function (req, res, next) {
        if (!req.params.bid) {
            res.redirect('/');
            return;
        }

        Post.get(req.params.bid, function (err, post) {
            if (err) {
                console.log(err);
                return next(err);
            }

            if (!post) {
                res.render('404', {
                    status: 404, layout: false
                });
                return;
            }
            res.json('detail', post);
        });
    },

    save_post: function (req, res, next) {
        var title = req.body['title'];
        var content = req.body['content'];
        var author = req.session.user.uid;
        var category = req.body['category'];

        var post = new Post({
            title: title,
            content: content,
            author: author,
            category: category
        });

        post.save(function (err) {
            if (err) {
                console.log(err);
                return res.json({msg: '保存失败'});
            }
            res.json({msg: '保存成功'});
        });
    },

    get_post_detail: function (req, res, next) {
        if (!req.params.bid) {
            res.redirect('/');
            return;
        }

        Post.getAll(function (err, posts) {

            if (err) {
                return next(err);
            }
            Link.getAll(function (err, links) {
                if (err) {
                    return next(err);
                }

                Post.get(req.params.bid, function (err, post) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }
                    if (!post) {
                        res.render('404', {
                            status: 404, layout: false
                        });
                        return;
                    }
                    res.render('detail', {post: post, posts: posts, links: links});
                });
            });
        });
    },

    edit_post: function (req, res, next) {
        var bid = req.body['bid'];
        var title = req.body['title'];
        var content = req.body['content'];
        var category = req.body['category'];

        if (!bid) {
            res.redirect('/admin/main');
            return;
        }

        var post = new Post({
            bid: bid,
            title: title,
            content: content,
            category: category
        });

        post.update(function (err) {
            if (err) {
                console.log(err);
                return res.json({msg: 'error'});
            }
            res.json({msg: 'success'});
        });
    },

    delete_post: function (req, res, next) {
        if (!req.params.bid) {
            res.redirect('/');
            return;
        }

        Post.remove(req.params.bid, function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.redirect('/admin/list');
        });
    }
}

