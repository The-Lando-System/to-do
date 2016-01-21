// Set Up =============================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');

// Configuration ======================
console.log("----- Configuration -----");
var devConfig = false;
try {
	devConfig = require('./config/config');
	console.log('[x] Found Dev Config File! Happy Debugging!');
} catch(err) {
	console.log('[x] No Dev Config File... Going into Production!');
}

var dbUrl =  devConfig ? devConfig.db : process.env.DB_URL;
var secretStr = devConfig ? devConfig.secret : process.env.SECRET;

try {
	mongoose.connect(dbUrl);
	console.log('[x] Successfully Connected to Mongo!');
} catch(err) {
	console.log('[] Failed to Connect to Mongo.....');
}

app.set('superSecret', secretStr);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Routes ==============================
require('./app/adminRoutes')(app);
require('./app/userRoutes')(app);
require('./app/routes')(app);

// Export the app ======================
exports = module.exports = app;
console.log("------> Ready! <---------");