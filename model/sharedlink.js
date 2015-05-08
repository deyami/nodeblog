var db = require('./db');
var Q = require('q');

function SharedLink(link) {
    this.id = link.id;
    this.content = link.content;
    this.link = link.link;
    this.create_time = link.create_time;
}

module.exports = SharedLink;

SharedLink.getAll = function () {
    var deferred = Q.defer();
    var sql = 'SELECT id, content, link, create_time from sharedlink';
    db.query(sql, [], function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(new Error(err));
        } else if (results) {
            var links = [];
            for (var i = 0; i < results.length; i++) {
                var link = new SharedLink(results[i]);
                links.push(link);
            }
            deferred.resolve(links);
        }
    });
    return deferred.promise;
}

SharedLink.prototype.save = function () {
    var deferred = Q.defer();
    var sql = 'insert into sharedlink (content,link,create_time ) values (?,?,now());select last_insert_id() as id';
    db.query(sql, [this.text, this.link], function (err, result) {
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


