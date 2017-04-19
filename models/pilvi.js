// Tämä tuskin toimii, ymmärtääkseni module.exports ei oikein toimi jos se on kahteen kertaan.


var mongoose = require('mongoose');

var pilviSchema = mongoose.Schema({
	suku: String,
	kuvaus: String,
	lyhenne: String,
	taso: String
});

var pilvikuvaSchema = mongoose.Schema({
	img: { data: Buffer, contentType: String }
});

var Pilvi = mongoose.model('Pilvi',pilviSchema);
var PilviKuva = mongoose.model('PilviKuva',pilvikuvaSchema);

module.exports = Pilvi;
module.exports = PilviKuva;
