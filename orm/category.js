var mysql      = require('mysql');
var dbsetting  = require('./dbsetting');

var Category = function(category){
	this.cid = category.cid;
	this.name = category.name;
	console.log('category.cid: '+this.cid );
  console.log('category.name: '+this.name);
}

module.exports = Category;

Category.get = function(bid,callback){
	var connection = mysql.createConnection(dbsetting.mysql);
  connection.connect();
  var sql = 'SELECT cid, name  from category where cid = ?';
	connection.query(sql,[username], function(err, results) {
    if (err) { 
      console.log(err);
      callback(err);
      return;
    }
    
    if(results && results.length){
      var category = new Category(results[0]);
      connection.end();
      callback(err,category);
      return;
    }  
    connection.end();//先关连接
    callback(err,null);
	});
};

Category.getAll = function(callback){
	var connection = mysql.createConnection(dbsetting.mysql);
  	connection.connect();
  	var sql = 'SELECT cid,name from category ';
    connection.query(sql,[], function(err, results) {
    if (err) { 
      console.log(err);
      callback(err);
      return;
    }
    console.log('results: '+results);
    if(results && results.length){
    	var categorys = [];
    	for(var i=0;i<results.length;i++){
    		 var category = new Category(results[i]);
    		 categorys.push(category);
    	}
     
      connection.end();//先关连接
      callback(err,categorys);
      return;
    }  
    connection.end();
    callback(err,[]);
	});
};

Category.prototype.save = function(callback){
  var connection = mysql.createConnection(dbsetting.mysql);
  connection.connect();
  var sql = 'insert into category (name) values (?)';
	connection.query(sql,[this.name] ,function(err, result) {
    connection.end();//先关连接
  	callback(err);
	}); 
};