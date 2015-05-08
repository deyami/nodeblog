var mysql = require('mysql');
var dbsetting = require('./dbsetting');
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

Post.get = function (bid) {
    var deferred = Q.defer();
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT pid, title,content,author,create_time,last_update,category  from post where pid= ? ';
    connection.query(sql, [bid], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results && results.length) {
            deferred.resolve(results);
        }
        connection.end();
        return deferred.promise;
    });
};

Post.remove = function (bid, callback) {
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'delete  from post where bid= ?';
    connection.query(sql, [bid], function (err, result) {
        connection.end();
        callback(err);
    });
};

Post.prototype.update = function (callback) {
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'update post set  title=?,content=?, category=? , last_update=now() where pid=?';
    connection.query(sql, [this.title, this.content, this.category, this.bid], function (err, result) {
        connection.end();
        callback(err);
    });
};

Post.getAll = function () {
    var deferred = Q.defer();
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT a.pid, a.title,a.content,b.username as author,a.create_time,a.last_update,a.category from post a, user b where a.author=b.uid  order by a.create_time desc';
    connection.query(sql, [], function (err, results) {
        console.log(results)
        if (err) {
            deferred.reject(new Error(err));
        } else if (results) {
            var posts = [];
            for (var i = 0; i < results.length; i++) {
                var post = new Post(results[i]);
                posts.push(post);
            }
            deferred.resolve(results);
        }
        connection.end();
    });
    return deferred.promise;
};

Post.prototype.save = function save(callback) {
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'insert into post (title,content,author,create_time, category , last_update) values (?,?,?,now(),?,now())';
    connection.query(sql, [this.title, this.content, this.author, this.category], function (err, result) {
        connection.end();
        callback(err);
    });
};
