var app = require('../../server');

// import the language driver
var pg = require('pg');
var assert = require('assert');

// Suport for body variables
var bodyParser = require('body-parser');

exports.getAll = function (req, res, next) {
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM api_user', function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				res.writeHead(200, { 'Content-Type': 'application/json' });
				console.log( result.rows );
				res.write(JSON.stringify(result.rows));
				res.end();
			}
		});
	});
};

exports.post = function (req, res, next) {
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('insert into api_user (id, name, password, profession, postDate, putDate, deleteDate) values ($1,$2,$3,$4,now(),null,null) RETURNING _id, id, name, password, profession, postDate, putDate, deleteDate',[req.body.id,req.body.name,req.body.password,req.body.profession], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				res.writeHead(200, { 'Content-Type': 'application/json' });
				console.log( result.rows );
				res.write(JSON.stringify(result.rows));
				res.end();
			}
		});
	});
};

exports.getOne = function (req, res, next) {
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM api_user where id = $1',[req.params.id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				res.writeHead(200, { 'Content-Type': 'application/json' });
				console.log( result.rows );
				res.write(JSON.stringify(result.rows));
				res.end();
			}
		});
	});
};

exports.delete = function (req, res, next) {

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM api_user where id = $1',[req.params.id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				var userFound = result.rows;
				client.query('delete FROM api_user where id = $1',[req.params.id], function(err, result) {
					done();
					if (err) {
						console.error(err);
						res.send("Error " + err);
					}else{
						res.writeHead(200, { 'Content-Type': 'application/json' });
						console.log( userFound );
						res.write(JSON.stringify(userFound));
						res.end();
					}
				});
			}
		});
	});
};

exports.put = function (req, res, next) {

   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM api_user where id = $1',[req.body.id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				var userFound = result.rows;
				client.query('update api_user set name=$2, password=$3, profession=$4, postDate = coalesce(postDate,now()), putDate = now(), deleteDate = deleteDate where id = $1',[req.body.id,req.body.name,req.body.password,req.body.profession], function(err, result) {
					done();
					if (err) {
						console.error(err);
						res.send("Error " + err);
					}else{
						res.writeHead(200, { 'Content-Type': 'application/json' });
						console.log( userFound );
						console.log( '**************************' );
						console.log( result );
						res.write(JSON.stringify(userFound));
						res.end();
					}
				});
			}
		});
	});
};

exports.findOne = function (id, functionDone) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM api_user where id = $1 and deleteDate is null',[id], function(err, result) {
			done();
			if (err) {
				console.log('user not found for the id '+id);
				console.error(err);
				return functionDone(null, 'user not found for the id '+id);
			}else{
				if (result.rows.length>0){				
					console.log('user found for the id '+id);
					console.log(result.rows[0]);
					return functionDone(result.rows[0], false);
				}else{
					console.log('user not found for the id '+id);
					console.error(err);
					return functionDone(null, 'user not found for the id '+id);
				}
			}
		});
	});
};