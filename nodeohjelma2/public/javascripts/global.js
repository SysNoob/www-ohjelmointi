// käyttäjälistalle array huom. Globaali!
var kayttajaListaData = [];

// DOM:in käyttöön otto
$(document).ready(function() {
	
	// täytetään taulukko tiedoilla ladatessa sivua ekaa kertaa
	taytaTaulukko();
	
	// Käyttäjänimen linkin painaminen
	$('#kayttajaLista table tbody').on('click', 'td a.linkkinaytakayttaja', naytaKayttajaInfo);

	// Käyttäjän lisääminen
	$('#btnLisaaKayttaja').on('click', lisaaKayttaja);
	
	// Käyttäjän poisto
	$('#kayttajaLista table tbody').on('click', 'td a.linkkipoistakayttaja', poistaKayttaja);
	
});

// html-Taulukon täyttö
function taytaTaulukko() {

	var taulukkoSisalto = '';
	
	// jQuery AJAX kutsu users.js;n käyttäjälistaan, joka palauttaa 'data' muuttujalle tietokannan tiedot.
	$.getJSON('/users/kayttajalista', function(data) {
		
		// tallennetaan data globaaliin arrayyn
		kayttajaListaData = data;
		
		// Aseta jokaiselle käyttäjätiedolle tietokannassa taulukkoon oma kohta
		$.each(data, function() {
			// taulukkoSisalto:on liitetään kaikki yhdelle käyttäjälle riippuvat tiedot html muotoon
			// <tr> viittaa yhteen riviin, <td> on yksi solu
			// Taulukon kolumnien nimet ovat ovat | KäyttäjäNimi | Sähköposti | Poista |
			taulukkoSisalto += '<tr>';
			taulukkoSisalto += '<td><a href="#" class="linkkinaytakayttaja" rel="' + this.nimi +'">' + this.nimi + '</a></td>';
			taulukkoSisalto += '<td>' + this.sposti + '</td>';
			taulukkoSisalto += '<td><a href="#" class="linkkipoistakayttaja" rel="' + this._id +'">poista</a></td>';
			taulukkoSisalto += '</tr>';
			
		});
		
		// Syötetään koko taulukon sisältö string HTML:n taulukkoon
		$('#kayttajaLista table tbody').html(taulukkoSisalto);
	
	});
	
};


// Näytetään käyttäjän tiedot
function naytaKayttajaInfo(event) {
	
	//Estetään linkkiä toimimasta
	event.preventDefault()
	
	// Noudetaan käyttäjänimi linkin relaatio atrribuutista
	var tamaKayttajaNimi = $(this).attr('rel');
	
	// Objektin indexi id arvon mukaan
	// map():ssa arrayAsia viittaa aina yhteen kayttajaListaDatan objekteista
	// map():n funktio laittaa map() palauttamaan uuden arrayn, joka sisältää vain objektien käyttäjänimet
	// indexOf() etsii halutun käyttäjän sijainnin taulukosta
	var arrayIndexi = kayttajaListaData.map(function(arrayAsia) {return arrayAsia.nimi;}).indexOf(tamaKayttajaNimi);
	
	// Nyt tiedetään indexi, joten voidaan etsiä kaikki käyttäjän tiedot kayttajaListaData arraysta.
	var tamaKayttajaObjekti = kayttajaListaData[arrayIndexi];
	
	// Täytetään infolaatikko
	$('#kayttajaInfoKokoNimi').text(tamaKayttajaObjekti.kokonimi);
	$('#kayttajaInfoIka').text(tamaKayttajaObjekti.ika);
	$('#kayttajaInfoSukupuoli').text(tamaKayttajaObjekti.sukupuoli);
	$('#kayttajaInfoSijainti').text(tamaKayttajaObjekti.sijainti);

}


// Käyttäjän lisääminen
function lisaaKayttaja(event) {
	
	event.preventDefault();
	
	// Yksinkertainen validaatio
	var virheet = '';
	var virheMaara = 0;
	
	// Kaikissa kohdissa täytyy olla jotain
	$('#lisaaKayttaja input').each(function(indexm, val) {	// jQueryllä käydään läpi kaikki vastaavat elementit
		if($(this).val() === '') {
			virheMaara++;
		}
	});
	
	if(virheMaara !== 0) {
		virheet += 'Täytä kaikki kohdat\n';
	} 
	
	// Sähköpostin tarkistus Regular expressionin avulla
	var spostiExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	
	if( !spostiExp.test($('#lisaaKayttaja fieldset input#inputKayttajaSahkoposti').val()) ) {
		virheet += 'Sähköpostin täytyy olla kelvollinen\n';
	}
	
	// Ikä saa sisältää vain lukuja ja olla vähintään 18
	var ikaExp = /\b\d{2,3}\b/;		// regEx hyväksyy tekstit, joissa on pelkästään 2 tai 3 lukua
	if( !ikaExp.test($('#lisaaKayttaja fieldset input#inputKayttajaIka').val()) 
	|| $('#lisaaKayttaja fieldset input#inputKayttajaIka').val() < 18 ) {
		virheet += 'Teidän täytyy olla vähintään 18 vuotta vanha, ja kenttä saa sisältää vain numeroita\n';
	}
	
	// Käyttäjänimi ei saa sisältää välejä tai erikoiskirjaimia
	var nimiExp = /\s|\W/;	// Palauttaa true, jos sisältää yhdenkin erikoismerkin tai välimerkin (myös åöä)
	if( nimiExp.test($('#lisaaKayttaja fieldset input#inputKayttajaNimi').val()) ) {
		virheet += 'Käyttäjänimi ei saa sisältää erikoismerkkejä\n';
	}
	
	// Käyttäjän sukupuoli saa olla 'Mies' tai 'Nainen, muutetaan arvo yhtenäiseen kirjoitusmuotoon'
	if( $('#lisaaKayttaja fieldset input#inputKayttajaSukupuoli').val().toLowerCase() === 'mies' ) {
		$('#lisaaKayttaja fieldset input#inputKayttajaSukupuoli').val('Mies');
		
	} else if ( $('#lisaaKayttaja fieldset input#inputKayttajaSukupuoli').val().toLowerCase() === 'nainen' ) {
		$('#lisaaKayttaja fieldset input#inputKayttajaSukupuoli').val('Nainen');
		
	} else {
		virheet += 'Kirjoita sukupuoli muotoon "Mies" tai "Nainen"\n';
	}
	
	if(virheet === '') {	
	
		// Yhdistetään kaikki käyttäjäinfo yhdeksi objektiksi AJAXia varten
		var uusiKayttaja = {
			'nimi': $('#lisaaKayttaja fieldset input#inputKayttajaNimi').val(),
			'sposti': $('#lisaaKayttaja fieldset input#inputKayttajaSahkoposti').val(),
			'kokonimi': $('#lisaaKayttaja fieldset input#inputKayttajaKokoNimi').val(),
			'ika': $('#lisaaKayttaja fieldset input#inputKayttajaIka').val(),
			'sijainti': $('#lisaaKayttaja fieldset input#inputKayttajaSijainti').val(),
			'sukupuoli': $('#lisaaKayttaja fieldset input#inputKayttajaSukupuoli').val(),
		}
		
		// Syötetään AJAXilla lisaakayttajaan users.js:n
		// data: päästään käsiksi users.js req.bodylla
		$.ajax({
			type: 'POST',
			data: uusiKayttaja,
			url: '/users/lisaakayttaja',
			dataType: 'JSON'
		}).done(function(response) {
		
			// Tarkistetaan että vastaus on oikeellinen (tyhjä '')
			if(response.msg === '') {
				
				// Tyhjennetään formi laittamalla kaikkiin '' sisällöksi
				$('#lisaaKayttaja fieldset input').val('');
				
				// Päivitetään taulukko
				taytaTaulukko();
				
			} else {
			
				// Virhetilanteessa palauta error viesti, jonka 'palvelu' antaa meille
				alert('Error: ' + response.msg);
				
			}
		});
	
	} else {
		// Jos virheet !== '' tulosta virheviestit ja älä tee muuta
		alert('Virheet lomaketta syötettäessä:\n' + virheet);
		return false;
	}

};


// Poista Käyttäjä
function poistaKayttaja(event) {
	event.preventDefault();
	
	//Varmistetaan, että käyttäjä halutaan poistaa
	var varmistus = confirm('Oletteko aivan varma, että haluatte poistaa käyttäjän?');
	
	if (varmistus === true) {
		// Lähetetään delete pyyntö, jonka urlin perään liitetään käyttäjän id
		// users.js vastaanottaa pyynnön ja tekee varsinaisen poistamisen
		$.ajax({
			type: 'DELETE',
			url: '/users/poistakayttaja/' + $(this).attr('rel')
		}).done(function(response) {
		
			//Tarkistetaan vastauksen oikeellisuus (tyhjä '')
			if(response.msg === '') {
			
			} else {
			
				alert('Error: ' + response.msg);
			}
			
			//Päivitetään taulukko
			taytaTaulukko();
		});
		
	} else {
	
		// Ei tehdä mitään, jos käyttäjä ei halunnut poistaa
		return false;
	}
}




