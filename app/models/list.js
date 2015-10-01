var mongoose = require('mongoose');

module.exports = mongoose.model('List', {
	name:     { type: String, default: '' },
	username: { type: String, default: '' }
});