var db = require('./db');
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
    var sql = 'SELECT cid, name  from category where cid = ?';
    db.query(sql, [username], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            var category = new Category(results[0]);
            deferred.resolve(category);
        }
    });
    return deferred.promise;
};

Category.getAll = function () {
    var deferred = Q.defer();
    var sql = 'SELECT cid,name from category ';
    db.query(sql, [], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            var categorys = [];
            for (var i = 0; i < results.length; i++) {
                var category = new Category(results[i]);
                categorys.push(category);
            }
            deferred.resolve(categorys);
        }
    });
    return deferred.promise;
};

Category.prototype.save = function () {
    var deferred = Q.defer();
    var sql = 'insert into category (name) values (?)';
    db.query(sql, [this.name], function (err, result) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};