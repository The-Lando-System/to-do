var jwt = require('jsonwebtoken');
var express = require('express');

var Todo = require('./models/todo');
var List = require('./models/list');

var userApiRoutes = express.Router();

module.exports = function(app) {

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


	// User To-Do lists ===========================
	userApiRoutes.get('/:username/lists', function(req,res){
		if (req.decoded.username === req.params.username) {
			List.find({ username:req.params.username },function(err,lists){
				if (err) { res.send(err) };
				res.json(lists);
			});
		} else {
			res.json({ message: 'You are not authorized to view to-do lists for ' + req.params.username });
		}
	});
	userApiRoutes.post('/:username/lists', function(req,res){
		if (req.decoded.username === req.params.username) {
			List.create({ 
				name:     req.body.name,
				username: req.params.username
			}, function(err,list){
				if (err) { res.send(err) };
				res.json({ message: 'To-Do List successfully created!' });
			});
		} else {
			res.json({ message: 'You are not authorized to create to-do lists for ' + req.params.username });
		}
	});
	userApiRoutes.delete('/:username/lists/:list_id', function(req,res){
		if (req.decoded.username === req.params.username) {
			List.remove({
				_id: req.params.list_id
			}, function(err,list){
				if (err) { res.send(err) };
				res.json({ message: 'To-Do List successfully removed!' });
			});
		} else {
			res.json({ message: 'You are not authorized to delete to-do lists for ' + req.params.username });
		}
	});
	userApiRoutes.put('/:username/lists/:list_id', function(req,res){
		if (req.decoded.username === req.params.username) {
			List.findById(req.params.list_id, function(err,list){
				if (err) { res.send(err) };
				list.name = req.body.name;
				list.save(function(err){
					if (err) { res.send(err) };
					res.json({ message: 'List name was successfully updated!' });
				});
			});
		} else {
			res.json({ message: 'You are not authorized to edit list name for ' + req.params.username });
		}
	});


	// User To-Do's for a specific list =============================
	userApiRoutes.get('/:username/list/:list_id/todos', function(req,res){
		if (req.decoded.username === req.params.username) {
			Todo.find({ 'username':req.params.username, 'list.id':req.params.list_id },function(err,todos){
				if (err) { res.send(err) };
				res.json(todos);
			});
		} else {
			res.json({ message: 'You are not authorized to view to-dos for ' + req.params.username });
		}
	});
	userApiRoutes.post('/:username/list/:list_id/todos', function(req,res){
		if (req.decoded.username === req.params.username) {
			Todo.create({
				text: req.body.text,
				username: req.params.username,
				list: {
					name: req.body.listName,
					id:   req.params.list_id
				},
				done: false
			}, function(err,todo){
				if (err) { res.send(err) };
				res.json({ message: 'To-Do successfully added!' });
			});
		} else {
			res.json({ message: 'You are not authorized to create to-dos for ' + req.params.username });
		}
	});
	// Perhaps delete only the list property from the to-do?
	/* userApiRoutes.delete('/:username/list/:list_id/todos/:todo_id', function(req,res){
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
	}); */


	// All User To-Do's ===========================
	userApiRoutes.get('/:username/todos', function(req,res){
		if (req.decoded.username === req.params.username) {
			Todo.find({ username:req.params.username },function(err,todos){
				if (err) { res.send(err) };
				res.json(todos);
			});
		} else {
			res.json({ message: 'You are not authorized to view to-dos for ' + req.params.username });
		}
	});
	userApiRoutes.post('/:username/todos', function(req,res){
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
	userApiRoutes.delete('/:username/todos/:todo_id', function(req,res){
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
	userApiRoutes.put('/:username/todos/:todo_id', function(req,res){
		if (req.decoded.username === req.params.username) {
			Todo.findById(req.params.todo_id, function(err,todo){
				if (err) { res.send(err) };
				todo.text = req.body.text;
				todo.save(function(err){
					if (err) { res.send(err) };
					res.json({ message: 'Todo was successfully updated!' });
				});
			});
		} else {
			res.json({ message: 'You are not authorized to edit to-dos for ' + req.params.username });
		}
	});


	app.use('/user',userApiRoutes);

};