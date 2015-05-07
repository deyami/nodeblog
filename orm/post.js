var mysql = require('mysql');
var dbsetting = require('./dbsetting');
var Q = require('q');

var Post = function (post) {
    this.bid = post.bid;
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
    var sql = 'SELECT bid, title,content,author,create_time,last_update,category  from post where bid= ? ';
    connection.query(sql, [bid], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results && results.length) {
            deferred.resolve(results);
        }
        connection.end();
        return deferred;
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
    var sql = 'update post set  title=?,content=?, category=? , last_update=now() where bid=?';
    connection.query(sql, [this.title, this.content, this.category, this.bid], function (err, result) {
        connection.end();
        callback(err);
    });
};

Post.getAll = function () {
    var deferred = Q.defer();
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT a.bid, a.title,a.content,b.username as author,a.create_time,a.last_update,c.name as category from post a, user b , category c where a.author=b.uid and a.category=c.cid order by a.create_time desc';
    connection.query(sql, [], function (err, results) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (results && results.length) {
            var posts = [];
            for (var i = 0; i < results.length; i++) {
                var post = new Post(results[i]);
                posts.push(post);
            }
            deferred.resolve(results);
        }
        connection.end();
    });
    return deferred;
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
