var mysql = require('mysql');
var Q = require('q');


function recordDBConf(){
    var deferred = Q.defer();
    return deferred.promise;
}

function testConn() {
    var deferred = Q.defer();
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT 1';
    connection.query(sql, function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            deferred.resolve(true);
        }
        connection.end();//先关连接
    });
    return deferred.promise;
}

function initDB() {
    var deferred = Q.defer();
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT 1';
    connection.query(sql, function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            deferred.resolve(true);
        }
        connection.end();//先关连接
    });
    return deferred.promise;
}

recordDBConf().then(testConn()).then()

