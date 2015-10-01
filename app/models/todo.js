var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	text: 	  { type: String, default: '' },
	username: { type: String, default: '' },
	list:     { 
		name:   { type: String, default: '' },
		id:     { type: String, default: '' }
	}
});