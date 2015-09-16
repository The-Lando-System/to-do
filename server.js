// Set Up =============================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Configuration ======================
var db = require('./config/db');
var port = process.env.PORT || 3000;
mongoose.connect(db.url);
var secret = require('./config/secret');
app.set('superSecret', secret.str);
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));

// Routes ==============================
require('./app/routes')(app)

// Listen (Start the app with node server.js) ==============
app.listen(port);
console.log('App is listening on port ' + port);
exports = module.exports = app;