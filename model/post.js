var db = require('./db');
var Q = require('q');

var Post = function (post) {
    this.pid = post.pid;
    this.title = post.title;
    this.content = post.content;
    this.author = post.author;
    this.category = post.category;
    this.create_time = post.create_time;
    this.last_update = post.last_update;
}

module.exports = Post;

Post.get = function (pid) {
    var deferred = Q.defer();
    var sql = 'SELECT pid, title,content,author,create_time,last_update,category  from post where pid= ? ';
    db.query(sql, [pid], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            var posts = [];
            for (var i = 0; i < results.length; i++) {
                var post = new Post(results[i]);
                posts.push(post);
            }
            deferred.resolve(posts[0]);
        }
    });
    return deferred.promise;
};

Post.remove = function (bid) {
    var deferred = Q.defer();
    var sql = 'delete  from post where bid= ?';
    db.query(sql, [bid], function (err, result) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (result) {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

Post.prototype.update = function () {
    var deferred = Q.defer();
    var sql = 'update post set  title=?,content=?, category=? , last_update=now() where pid=?';
    db.query(sql, [this.title, this.content, this.category, this.bid], function (err, result) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (result) {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

Post.getAll = function () {
    var deferred = Q.defer();
    var sql = 'SELECT a.pid, a.title,a.content,b.username as author,a.create_time,a.last_update,a.category from post a, user b where a.author=b.uid  order by a.create_time desc';
    db.query(sql, [], function (err, results) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (results) {
            var posts = [];
            for (var i = 0; i < results.length; i++) {
                var post = new Post(results[i]);
                posts.push(post);
            }
            deferred.resolve(posts);
        }
    });
    return deferred.promise;
};

Post.prototype.save = function save() {
    var deferred = Q.defer();
    var sql = 'insert into post (title,content,author,create_time, category , last_update) values (?,?,?,now(),?,now())';
    db.query(sql, [this.title, this.content, this.author, this.category], function (err, result) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (result) {
            deferred.resolve(posts);
        }
    });
    return deferred.promise;
};
