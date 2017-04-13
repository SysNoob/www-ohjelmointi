var express = require('express');
var router = express.Router();


/* GET käyttäjälista */

router.get('/kayttajalista', function(req, res) {

	var db = req.db;
	var tietokanta = db.get('käyttäjät');
	tietokanta.find({},{}, function(e, docs){
		res.json(docs);
	});

});

/*POST Lisää käyttäjä*/

router.post('/lisaakayttaja', function(req, res) {

	var db = req.db;
	var tietokanta = db.get('käyttäjät');
	tietokanta.insert(req.body, function(err, result){
		res.send(
			(err === null) ? { msg: ''} : { msg: err }
		);
	});
});

/* DELETE poistetaan käyttäjä*/

router.delete('/poistakayttaja/:id', function(req, res) {
	var db = req.db;
	var tietokanta = db.get('käyttäjät');
	var kayttajaPoisto = req.params.id;
	tietokanta.remove({ '_id': kayttajaPoisto }, function(err) {
		res.send((err === null) ? { msg: '' } : { msg:'Error: ' + err });
	});
});


module.exports = router;
