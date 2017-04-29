// Tämä tuskin toimii, ymmärtääkseni module.exports ei oikein toimi jos se on kahteen kertaan.


var mongoose = require('mongoose');

var pilviSchema = mongoose.Schema({
	suku: String,
	kuvaus: String,
	lyhenne: String,
	taso: String
});

var Pilvi = mongoose.model('Pilvi',pilviSchema);

module.exports = Pilvi;

