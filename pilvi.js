var mongoose = require('mongoose'):

var pilviSchema = mongoose.Schema({
	suku: String,
	kuvaus: String,
	lyhenne: String,
	taso: String
});

var Pilvi = mongoose.model('Pilvi',lomaSchema);

module.exports = Pilvi;