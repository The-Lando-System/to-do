var jwt = require('jsonwebtoken');
var express = require('express');
var path = require('path');

var User = require('./models/user');

var baseDir = path.resolve(__dirname + '/..');

module.exports = function(app) {

	// User Authentication
	app.post('/authenticate', function(req,res){
		User.findOne({
			username: req.body.username		
		}, function(err,user){
			if (err) throw err;
			if (!user) {
				console.log("WARNING: Authentication failed! Could not find user: " + req.body.username);
				res.json({ success: false, message: 'Authentication failed, user not found!' });
			} else if (user) {
				if (user.password != req.body.password) {
					console.log("WARNING: Authentication failed! Wrong password for user: " + req.body.username);
					res.json({ success: false, message: 'Authentication failed, wrong password!' });
				} else {
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresIn: 86400 
					});
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}
			}
		});
	});

	// Application Routes ======================
	app.get('/', function(req,res){
		res.sendFile(baseDir + '/public/views/index.html');
	});
	app.get('/login', function(req,res){
		res.sendFile(baseDir + '/public/views/login.html');
	});
	app.get('/to-do-list', function(req,res){
		res.sendFile(baseDir + '/public/views/to-do-list.html');
	});
	app.get('/user-lists', function(req,res){
		res.sendFile(baseDir + '/public/views/user-lists.html');
	});
	app.get('/user-management', function(req,res){
		res.sendFile(baseDir + '/public/views/user-management.html');
	});
	app.get('/user-page', function(req,res){
		res.sendFile(baseDir + '/public/views/user.html');
	});
};