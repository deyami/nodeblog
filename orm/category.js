var mysql = require('mysql');
var dbsetting = require('./dbsetting');
var Q = require('q');

var Category = function (category) {
    this.cid = category.cid;
    this.name = category.name;
    console.log('category.cid: ' + this.cid);
    console.log('category.name: ' + this.name);
}

module.exports = Category;

Category.get = function (bid) {
    var deferred = Q.defer();
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT cid, name  from category where cid = ?';
    connection.query(sql, [username], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results && results.length) {
            var category = new Category(results[0]);
            deferred.resolve(category);
        }
        connection.end();//先关连接
        return deferred;
    });
};

Category.getAll = function () {
    var deferred = Q.defer();
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT cid,name from category ';
    connection.query(sql, [], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results && results.length) {
            var categorys = [];
            for (var i = 0; i < results.length; i++) {
                var category = new Category(results[i]);
                categorys.push(category);
            }
            deferred.resolve(categorys);
        }
        connection.end();
        return deferred;
    });
};

Category.prototype.save = function (callback) {
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'insert into category (name) values (?)';
    connection.query(sql, [this.name], function (err, result) {
        connection.end();//先关连接
        callback(err);
    });
};