var app = require('../../server');

// import the language driver
var pg = require('pg');
var assert = require('assert');

// Suport for body variables
var bodyParser = require('body-parser');

exports.getAll = function (req, res, next) {
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM store', function(err, result) {
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
		client.query('insert into store (id, name, pictureUrl, address, postalCode, postDate, putDate, deleteDate) values ($1,$2,$3,$4,$5,now(),null,null) RETURNING _id, id, name, pictureUrl, address, postalCode, postDate, putDate, deleteDate',[req.body.id,req.body.name,req.body.pictureUrl,req.body.address,req.body.postalCode], function(err, result) {
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
		client.query('SELECT * FROM store where id = $1',[req.params.id], function(err, result) {
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
		client.query('SELECT * FROM store where id = $1',[req.params.id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				var userFound = result.rows;
				client.query('delete FROM store where id = $1',[req.params.id], function(err, result) {
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
		client.query('SELECT * FROM store where id = $1',[req.body.id], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.send("Error " + err);
			}else{
				var userFound = result.rows;
				client.query('update store set name=$2, pictureUrl=$3, address=$4, postalCode=$5, postDate = coalesce(postDate,now()), putDate = now(), deleteDate = deleteDate where id = $1',[req.body.id,req.body.name,req.body.pictureUrl,req.body.address,req.body.postalCode], function(err, result) {
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

exports.getByPostalCode = function (req, res, next) {
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM store where postalCode = $1',[req.params.id], function(err, result) {
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