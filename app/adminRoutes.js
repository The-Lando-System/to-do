var jwt = require('jsonwebtoken');
var express = require('express');

var Todo = require('./models/todo');
var User = require('./models/user');

var adminApiRoutes = express.Router();

module.exports = function(app) {

	// Admin To-Do API Routes ==============================
	adminApiRoutes.use(function(req,res,next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if (token) {
			jwt.verify(token, app.get('superSecret'), function(err,decoded){
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token!'});
				} else {
					if (decoded.role === 'admin'){
						req.decoded = decoded;
						next();
					}
				}
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided!'
			});
		}
	});
	adminApiRoutes.get('/todos', function(req,res){
		Todo.find(function(err,todos){
			if (err) { res.send(err) };
			res.json(todos);
		});
	});
	adminApiRoutes.post('/todos', function(req,res){
		Todo.create({
			text: req.body.text,
			username: req.body.username,
			done: false
		}, function(err,todo){
			if (err) { res.send(err) };
			Todo.find(function(err,todos){
				if (err) { res.send(err) };
				res.json(todos);
			});
		});
	});
	adminApiRoutes.delete('/todos/:todo_id', function(req,res){
		Todo.remove({
			_id: req.params.todo_id
		}, function(err,todo){
			if (err) { res.send(err) };
			Todo.find(function(err,todos){
				if (err) { res.send(err) };
				res.json(todos);
			});
		});
	});


	// Routes for the users API, only exposed to admin users ======================
	adminApiRoutes.get('/users', function(req,res){
		User.find({}, function(err,users){
			if (err) { res.send(err) };
			res.json(users);
		});
	});
	adminApiRoutes.post('/users', function(req,res){
		User.create({
			firstName: req.body.firstName,
			lastName:  req.body.lastName,
			email:     req.body.email,
			username:  req.body.username,
			password:  req.body.password,
			role:      req.body.role 
		}, function(err,user){
			if (err) { res.send(err) };
			res.json({ message: 'User successfully created!' });
		});
	});
	adminApiRoutes.delete('/users/:id', function(req,res){
		User.remove({ _id: req.params.id }, function(err,user){
			if (err) { res.send(err) };
			res.json({ message: 'Successfully removed user with id ' + req.params.id });
		});
	});
	adminApiRoutes.put('/users/:id', function(req,res){
		User.findById(req.params.id, function(err,user){
			if (err) { res.send(err) };
			user.firstName = req.body.firstName || user.firstName;
			user.lastName  = req.body.lastName  || user.lastName;
			user.email     = req.body.email     || user.email;
			user.username  = req.body.username  || user.username;
			user.password  = req.body.password  || user.password;
			user.role      = req.body.role      || user.role;
			user.save(function(err){
				if (err) { res.send(err) };
				res.json({ message: 'User with ID ' + req.params.id + ' was successfully updated!' });
			});
		});
	});

	app.use('/admin',adminApiRoutes);

};