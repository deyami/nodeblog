var mysql = require('mysql');
var dbsetting = require('./dbsetting').mysql;
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
    var connection = mysql.createConnection(dbsetting);
    connection.connect();
    var sql = 'SELECT uid, username, password, create_time, last_login from user where username= ?';
    connection.query(sql, [username], function (err, results) {
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
        connection.end();
    });
    return deferred.promise;
}

User.prototype.save = function (callback) {
    var connection = mysql.createConnection(dbsetting);
    connection.connect();
    var sql = 'insert into user (username,password,create_time, last_login ) values (?,?,now(),now())';
    connection.query(sql, [this.username, this.password], function (err, result) {
        console.log(err)
        console.log(result)
        var insertId = result.insertId;
        connection.end();
        callback(err, insertId);
    });
};

