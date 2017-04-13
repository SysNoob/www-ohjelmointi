// käyttäjälistalle array
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
	
	// jQuery AJAX kutsu JSONiin
	$.getJSON('/users/kayttajalista', function(data) {
		
		// otetaan data globaaliin arrayyn
		kayttajaListaData = data;
		
		// Aseta jokaiselle käyttäjätiedolle tietokannassa taulukkoon oma kohta
		$.each(data, function() {
			
			taulukkoSisalto += '<tr>';
			taulukkoSisalto += '<td><a href="#" class="linkkinaytakayttaja" rel="' + this.nimi +'">' + this.nimi + '</a></td>';
			taulukkoSisalto += '<td>' + this.sposti + '</td>';
			taulukkoSisalto += '<td><a href="#" class="linkkipoistakayttaja" rel="' + this._id +'">poista</a></td>';
			taulukkoSisalto += '</tr>';
			
		});
		
		// Syötetään koko taulukon sisältä string HTML:n taulukkoon
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
	var arrayIndexi = kayttajaListaData.map(function(arrayAsia) {return arrayAsia.nimi;}).indexOf(tamaKayttajaNimi);
	
	// Haetaan Käyttäjä objekti
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
	var virheMaara = 0;
	$('#lisaaKayttaja input').each(function(indexm, val) {
		if($(this).val() === '') {
			virheMaara++;
		}
	});
	
	if(virheMaara === 0) {
	
		// Yhdistetään kaikki käyttäjäinfo yhdeksi objektiksi
		var uusiKayttaja = {
			'nimi': $('#lisaaKayttaja fieldset input#inputKayttajaNimi').val(),
			'sposti': $('#lisaaKayttaja fieldset input#inputKayttajaSahkoposti').val(),
			'kokonimi': $('#lisaaKayttaja fieldset input#inputKayttajaKokoNimi').val(),
			'ika': $('#lisaaKayttaja fieldset input#inputKayttajaIka').val(),
			'sijainti': $('#lisaaKayttaja fieldset input#inputKayttajaSijainti').val(),
			'sukupuoli': $('#lisaaKayttaja fieldset input#inputKayttajaSukupuoli').val(),
		}
		
		// Syötetään AJAXilla lisaakayttajaan
		$.ajax({
			type: 'POST',
			data: uusiKayttaja,
			url: '/users/lisaakayttaja',
			dataType: 'JSON'
		}).done(function(response) {
		
			// Tarkistetaan että vastaus on oikeellinen (tyhjä '')
			if(response.msg === '') {
				
				// Tyhjennetään formi
				$('#lisaaKayttaja fieldset input').val('');
				
				// Päivitetään taulukko
				taytaTaulukko();
			} else {
			
				// Virhetilanteessa palauta error viesti, jonka 'palvelu' antaa meille
				alert('Error: ' + response.msg);
				
			}
		});
	
	} else {
		// Jos virheMaara > 0, tulosta virhetilanteen viesti
		alert('Täytä kaikki kohdat, kiitos.');
		return false;
	}

};


// Poista Käyttäjä
function poistaKayttaja(event) {
	event.preventDefault();
	
	//Varmistetaan, että käyttäjä halutaan poistaa
	var varmistus = confirm('Oletteko aivan varma, että haluatte poistaa käyttäjän?');
	
	if (varmistus === true) {
	
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
		
	}else {
	
		// Ei tehdä mitään, jos käyttäjä ei halunnut poistaa
		return false;
	}
}




