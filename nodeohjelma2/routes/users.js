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


module.exports = router;
