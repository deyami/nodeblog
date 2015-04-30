var mysql = require('mysql');
var dbsetting = require('./dbsetting');

function User(user) {
    this.uid = user.uid;
    this.username = user.username;
    this.password = user.password;
    this.create_time = user.create_time;
    this.last_login = user.last_login;
}

module.exports = User;

User.get = function (username, callback) {
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT uid, username, password, create_time, last_login from user where username= ?';
    connection.query(sql, [username], function (err, results) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        if (results && results.length) {
            var user = new User(results[0]);
            connection.end();
            callback(err, user);
            return;
        }
        connection.end();
        callback(err, null);
    });
}

User.prototype.save = function (callback) {
    var connection = mysql.createConnection(dbsetting);
    connection.connect();
    var sql = 'insert into user (username,password,create_time, last_login ) values (?,?,now(),now());select last_insert_id() as id';
    connection.query(sql, [this.username, this.password], function (err, result) {
        var insertId = result.insertId;
        connection.end();
        callback(err, insertId);
    });
};

