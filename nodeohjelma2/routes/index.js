var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Heimaailma sivu. */
router.get('/heimaailma', function(req, res) {
	res.render('heimaailma', { title: 'Hei, Maailma!'});
});

/* GET Käyttäjäsivusto. */
router.get('/nimilista', function(req, res) {
	var db = req.db;
	var tietokanta = db.get('käyttäjät');
	tietokanta.find({},{}, function(e, docs) {
		res.render('nimilista', {
			'nimilista' : docs 
		});	
	});
});

/* GET Käyttäjien lisäämissivu */
router.get('/uusikayttaja', function(req, res) {
	res.render('uusikayttaja', {title: 'Lisää uusi käyttäjä'});
});

/*POST Käyttäjän lisääminen tietokantaan */
router.post('/lisaakayttaja', function(req, res) {

	/* Tietokannan käsittelyyn tarvittava muuttuja*/
	var db = req.db;
	
	/* Otetaan talteen formin sisältö, req.body viittaa inputtien name-atribuuttiin */
	var kayttajaNimi = req.body.kayttajanimi;
	var kayttajaSahkoposti = req.body.kayttajasahkoposti;
	
	/* Valitaan tietokannasta "käyttäjät"-alue */
	var tietokanta = db.get('käyttäjät');
	tietokanta.insert({
		'nimi' : kayttajaNimi,
		'sposti' : kayttajaSahkoposti
	}, function(err, doc) {
		
		if(err) {
			/*Virhetilanteessa palauttaa, virheen*/
			res.send('Virhe tietoja lisätessä tietokantaan');
		}else{
			/*Ei virhettä. Siirrytään katsomaan päivittynyttä sähköpostilistaa*/
			res.redirect('nimilista');
		}
	
	});
	
});

module.exports = router;
