$(document).ready(function(){

	// piilotetaan kaikki infoalueen lapset
	$("#infoAlue > div").hide();
	
	// Jos sivun ladatessa on selectissä jo valittuna kohta -> ladataan se
	if($("#valikko").val() !== "default") {
		naytaTietoJaKuvat();
	}
	
	// Lisätään tietojen näyttäminen select:in change tapahtumaan
	$("select").change( naytaTietoJaKuvat );
	
});

function naytaTietoJaKuvat() {
	$("#infoAlue > div").hide();	// Piilotetana kaikki infoalueen lapset
		
		var valinta = "#" + $("#valikko").val();	// Valittu kohta
		$(valinta).show();	// Näytetään valittu kohta
		
		var kansio = "img/" + $("#valikko").val() + "/";	// Kansio kuvan etsimistä varten
		if(!$(valinta + " img").length) {	// Jos kuvaa ei ole lisätty, haetaan se ajaxilla
			$.ajax({
				url: 'etsi' + kansio,	// etsiimg/:pilvi/
				type: 'GET',
				success: function(data) {	// Vastaukseksi tulee array tiedostonimiä
					data.forEach(function(kuva) {
						//$(valinta).append("<img src='" + kansio + kuva +"' id='infoKuva'>" );	// Lisätään kuvaelementit
						$(valinta).append("<a target='_blank' href='" + kansio + kuva + 
						"'><img src='" + kansio + kuva +"' id='infoKuva'></a>" );
					});
				}
			});
		}
}
