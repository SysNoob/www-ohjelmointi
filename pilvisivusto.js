var express = require('express');
var app = express();
var fs = require('fs'); // Kuvien näyttämiseen (Mahdollistaa serverin kansion sisällön listaamisen)

//Body-parser käyttöönotto Form Handlingia varten
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// MULTER ===============================================================================

var path = require('path');		// Helpottaa tiedostopäätteisiin pääsemiseksi (path.extname(filename))
var multer = require('multer'); // Kuvien vastaanottamiseen käyttäjältä

var storage = multer.diskStorage({	// Käytetään tiedostojen sijainnin ja nimen määritykseen. Palauttaa funktiota.

  destination: function (req, file, cb) {
    cb(null, __dirname + '/public/img/havainnot/');	// Sijainti
  },
  
  filename: function (req, file, cb) {
  	// Luodaan oma satunnainen tiedostonimi
  	var tiedosto = '';
	var merkit ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	
	do {
		var nimi = '';
		
		for( var i=0; i<10; i++) {
			// floor 'pyöristää', random antaa luvun väliltä 0-1, kertominen antaa luvun sopivalta väliltä.
			nimi += merkit.charAt(Math.floor(Math.random() * merkit.length));
		}
		tiedosto = nimi + path.extname(file.originalname);
		
	} while (fs.existsSync(tiedosto))	// Toistetaan niin kauan, kuin samanniminen tiedosto on olemassa
	
    cb(null, tiedosto);	// Tiedostonimen palauttaminen
  }
});

var upload = multer({storage: storage});	// otetaan käyttöön multerin toiminnot ja määritetään latauksen sijainti yllä luotuun storageen.

// /MULTER ==============================================================================

// Handlebars oletusnäkymämoottori
var handlebars = require('express-handlebars').create({ 
	defaultLayout:'paaulkonako'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

// Staattisten tiedostojen ja näkymien käyttöön otto
app.use(express.static(__dirname + '/public'));

// MongoDB käyttöön ottaminen

var mongoose = require('mongoose');
var Pilvi = require('./models/pilvi.js');
var credentials = require('./credentials.js');

var opts = {
	server: {
		socketOptions: { keepAlive: 120 }
	}	
};

// Otetaan yhteys MongoDB credentials.js tiedoston avulla
switch(app.get('env')){
	
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case 'production':
		mongoose.connect(credentials.mongo.production.connectionString, opts);
		break;
	default:
		throw new Error('Tuntematon käyttöympäristö: ' + app.get('env'));
}

app.get('/',function(req, res){
	res.render('kotisivu');
});

app.get('/pilviinfo',function(req, res){
	res.render('pilviinfo');
});

app.get('/pilvihavainnot',function(req, res){
	res.render('pilvihavainnot');
});

app.get('/pilvihavaintolomake',function(req, res){
	res.render('pilvihavaintolomake');
});

// Pilvihavaintolomakkeen vastaanotto
// upload.single() käyttää multeria vastaanottamaan yhden tiedoston
app.post('/havaintolahete', upload.single('kuva'), function(req,res) {

	// Pilven tason määritys
	var alapilvet = ["Stratus","Cumulus","Stratocumulus","Cumulonimbus"];
	var keskipilvet = ["Altocumulus","Altostratus","Nimbostratus"];
	var ylapilvet = ["Cirrus","Cirrostratus","Cirrocumulus"];
	var taso = "";
	
	if(alapilvet.indexOf(req.body.pilviSuku) !== -1) { 
		taso = "Alapilvi";
	} else if(keskipilvet.indexOf(req.body.pilviSuku) !== -1) { 
		taso = "Keskipilvi";
	} else if(ylapilvet.indexOf(req.body.pilviSuku) !== -1) { 
		taso = "Yläpilvi";
	}
	
	// Päivä ja kellonaika
	var paiva = new Date();
	
	// Lähetetään uusi pilvihavainto mlabiin
	new Pilvi({
		suku: req.body.pilviSuku,
		kuvaus: req.body.kuvaus,
		taso: taso,
		kuva: req.file.filename,	// Tiedoston uusi nimi, jonka itse määritimme ylhäällä
		maa: req.body.maa,
		kaupunki: req.body.kaupunki,
		peite: req.body.peite,
		paiva: paiva
	}).save();
	
	res.redirect(303, '/pilvihavainnot');
	
});

// Etsii pilviinfo sivulle pilvelle kuuluvat kuvat
app.get('/etsiimg/:pilvi', function(req, res) {
	var kansio = __dirname + '/public/img/' + req.params.pilvi + '/';	//fs vaatii koko tiedosto-osoitteen
	var tiedostot = [];	// Tiedostonimille taulukko
	fs.readdir( kansio , function(err, files) {	// Lukee kansion sisällön
		if(err) return;
		
		files.forEach(function(f) {	// jokainen tiedosto lisätään tiedostot-taulukkoon
			tiedostot.push('' + f.toString());
		});
		res.send(tiedostot);	// Palautetaan pilviinfo.js taulukko
	});
});

// 404 sivu
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

// 500 sivu
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

// Tähän lisätty myös env määritys
app.listen(app.get('port'), function(){
	console.log('Palvelin käynnissä ' + app.get('env') + ' moodissa osoitteessa localhost:' + app.get('port') + '.\nPaina Ctrl-C sammuttaaksesi');
});

