var jwt = require('jsonwebtoken');
var express = require('express');

var Todo = require('./models/todo');
var User = require('./models/user');

var userApiRoutes = express.Router();
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

	// User specific To-Do API routes ===========================
	userApiRoutes.use(function(req,res,next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if (token) {
			jwt.verify(token, app.get('superSecret'), function(err,decoded){
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token!'});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided!'
			});
		}
	});

	userApiRoutes.get('/todos/:username', function(req,res){
		if (req.decoded.username === req.params.username) {
			Todo.find({ username:req.params.username },function(err,todos){
				if (err) { res.send(err) };
				res.json(todos);
			});
		} else {
			res.json({ message: 'You are not authorized to view to-dos for ' + req.params.username });
		}
	});
	userApiRoutes.post('/todos/:username', function(req,res){
		if (req.decoded.username === req.params.username) {
			Todo.create({
				text: req.body.text,
				username: req.params.username,
				done: false
			}, function(err,todo){
				if (err) { res.send(err) };
				res.json({ message: 'To-Do successfully added!' });
			});
		} else {
			res.json({ message: 'You are not authorized to create to-dos for ' + req.params.username });
		}
	});
	userApiRoutes.delete('/todos/:username/:todo_id', function(req,res){
		if (req.decoded.username === req.params.username) {
			Todo.remove({
				_id: req.params.todo_id
			}, function(err,todo){
				if (err) { res.send(err) };
				res.json({ message: 'To-Do successfully removed!' });
			});
		} else {
			res.json({ message: 'You are not authorized to delete to-dos for ' + req.params.username });
		}
	});

	// User Routes, not exposed at the API level ======================
	app.get('/users', function(req,res){
		User.find({}, function(err,users){
			if (err) { res.send(err) };
			res.json(users);
		});
	});
	app.post('/users', function(req,res){
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
	app.delete('/users/:id', function(req,res){
		User.remove({ _id: req.params.id }, function(err,user){
			if (err) { res.send(err) };
			res.json({ message: 'Successfully removed user with id ' + req.params.id });
		});
	});
	app.put('/users/:id', function(req,res){
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

	// User Authentication
	app.post('/authenticate', function(req,res){
		User.findOne({
			username: req.body.username		
		}, function(err,user){
			if (err) throw err;
			if (!user) {
				res.json({ success: false, message: 'Authentication failed, user not found!' });
			} else if (user) {
				if (user.password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed, wrong password!' });
				} else {
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresInMinutes: 1440 
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

	app.use('/user',userApiRoutes);
	app.use('/admin',adminApiRoutes);

	// Application Routes ======================
	app.get('/', function(req,res){
		res.sendfile('./public/views/index.html');
	});
	app.get('/login', function(req,res){
		res.sendfile('./public/views/login.html');
	});
	app.get('/to-do-list', function(req,res){
		res.sendfile('./public/views/to-do-list.html');
	});

};