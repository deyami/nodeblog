var mysql = require('mysql');
var dbsetting = require('./dbsetting');

function SharedLink(link) {
    this.id = link.id;
    this.text = link.text;
    this.link = link.link;
    this.create_time = link.create_time;
}

module.exports = SharedLink;

SharedLink.getAll = function (callback) {
    var connection = mysql.createConnection(dbsetting.mysql);
    connection.connect();
    var sql = 'SELECT id, text, link, create_time from sharedlink';
    connection.query(sql, [], function (err, results) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        if (results && results.length) {
            var links = [];
            for (var i = 0; i < results.length; i++) {
                var link = new SharedLink(results[i]);
                links.push(link);
            }
            connection.end();
            callback(err, links);
            return;
        }
        connection.end();
        callback(err, null);
    });
}

SharedLink.prototype.save = function (callback) {
    var connection = mysql.createConnection(dbsetting);
    connection.connect();
    var sql = 'insert into sharedlink (text,link,create_time ) values (?,?,now());select last_insert_id() as id';
    connection.query(sql, [this.text, this.link], function (err, result) {
        var insertId = result.insertId;
        connection.end();
        callback(err, insertId);
    });
};


