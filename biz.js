var crypto = require('crypto');
var User = require('./model/user');
var Post = require('./model/post');
var Category = require('./model/category');
var Link = require('./model/sharedlink');
var setting = require('./setting');
var path = require('path');

var md5 = function (ps) {
    var md5 = crypto.createHash('md5');
    var pswd = md5.update(ps);
    pswd = md5.digest('base64');
    return pswd;
};

var setsession = function (req, user, remeberme) {
    if (req.session) {
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

        User.get(req.body['username']).then(function (user) {
            var error = '';
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

            user.save()
                .then(function (uid) {
                    user.uid = uid;
                    setsession(req, user);
                    res.redirect('/');
                }).catch(function (err) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }
                });
        }).catch(function (err) {
            if (err) {
                error = '注册发生错误';
                res.redirect('/');
            }
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

        User.get(req.body['username']).then(function (user) {
            if (!user) {
                err = '用户不存在';
            } else if (user.password != pswd) {
                err = '密码错误';
            }
            setsession(req, user, remeberme);
            return res.redirect('/');
        }).catch(function (err) {
            if (err) {
                res.locals.error = err;
                console.log(err);
                return next(err);
            }
        });
    },

    logout: function (req, res, next) {
        req.session.user = undefined;
        res.redirect('/');
    },

    get_post_data: function (req, res, next) {
        if (!req.params.bid) {
            res.redirect('/');
            return;
        }

        Post.get(req.params.bid).then(function (post) {
            if (!post) {
                res.render('404', {
                    status: 404, layout: false
                });
                return;
            }
            res.json('detail', post);
        }).catch(function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
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
        post.save()
            .then(function (result) {
                res.json({msg: '保存成功'});
            }).catch(function (err) {
                if (err) {
                    console.log(err);
                    return res.json({msg: '保存失败'});
                }
            });
    },

    get_post_detail: function (req, res, next) {
        if (!req.params.bid) {
            res.redirect('/');
            return;
        }
        var result = {};
        Post.getAll()
            .then(function (posts) {
                result["posts"] = posts;
                return Link.getAll();
            }).then(function (links) {
                result["links"] = links;
                return Post.get(req.params.bid);
            }).then(function (post) {
                result["post"] = post;
                if (!post) {
                    res.render('404', {
                        status: 404, layout: false
                    });
                } else {
                    res.render('detail', result);
                }
            }).catch(function (err) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
            });
    },

    edit_post: function (req, res, next) {
        var pid = req.body['pid'];
        var title = req.body['title'];
        var content = req.body['content'];
        var category = req.body['category'];

        var post = new Post({
            pid: pid,
            title: title,
            content: content,
            category: 0
        });

        post.update()
            .then(function (result) {
                res.json({msg: 'success'});
            }).catch(function (err) {
                if (err) {
                    console.log(err);
                    return res.json({msg: 'error'});
                }
            });
    },

    delete_post: function (req, res, next) {
        if (!req.params.bid) {
            res.redirect('/');
            return;
        }

        Post.remove(req.params.bid).then(function (result) {
            res.redirect('/admin/list');
        }).catch(function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
        });
    }
}

