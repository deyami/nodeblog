var db = require('./db');
var Q = require('q');

function User(user) {
    this.uid = user.uid;
    this.username = user.username;
    this.password = user.password;
    this.create_time = user.create_time;
    this.last_login = user.last_login;
}

module.exports = User;

User.get = function (username) {
    var deferred = Q.defer();
    var sql = 'SELECT uid, username, password, create_time, last_login from user where username= ?';
    db.query(sql, [username], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            var user = null;
            if(results.length > 0){
                var user = new User(results[0]);
            }
            deferred.resolve(user);
        }
    });
    return deferred.promise;
}

User.prototype.save = function () {
    var deferred = Q.defer();
    var sql = 'insert into user (username,password,create_time, last_login ) values (?,?,now(),now())';
    db.query(sql, [this.username, this.password], function (err, result) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (result) {
            var insertId = result.insertId;
            deferred.resolve(insertId);
        }
    });
    return deferred.promise;
};

