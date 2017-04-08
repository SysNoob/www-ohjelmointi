// käyttäjälistalle array
var kayttajaListaData = [];

// DOM:in käyttöön otto
$(document).ready(function() {
	
	// täytetään taulukko tiedoilla ladatessa sivua ekaa kertaa
	taytaTaulukko();
	
	// Käyttäjänimen linkin painaminen
	$('#kayttajaLista table tbody').on('click', 'td a.linkkinaytakayttaja', naytaKayttajaInfo);
	
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

