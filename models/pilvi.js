var mongoose = require('mongoose');

var pilviSchema = mongoose.Schema({
	suku: String,
	kuvaus: String,
	taso: String,
	kuva: String,
	maa: String,
	kaupunki: String,
	peite: Number,
	paiva: Date
});



var Pilvi = mongoose.model('Pilvi',pilviSchema);

module.exports = Pilvi;
