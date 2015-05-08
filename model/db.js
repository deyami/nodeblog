var mysql = require('mysql');
var dbsetting = require('./dbsetting');
var pool  = mysql.createPool(dbsetting.mysql);

module.exports = pool;