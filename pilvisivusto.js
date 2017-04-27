var express = require('express');
var app = express();
var fs = require('fs'); // Kuvien näyttämiseen

//Body-parser käyttöönotto Form Handlingia varten
app.use(require('body-parser').urlencoded({extended: true}));

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
var pilvi = require('./models/pilvi.js');
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

