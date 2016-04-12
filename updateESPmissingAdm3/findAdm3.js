/********************
	A bunch of the subregions in Spain didn't have admin3 names
	Here we take the admin3 info from the google maps API
	and add it to the gadm admin3 info
********************/

fs = require('fs');
var baseDirectory = "../individuals/spain/";

// create directory where we'll write new files if it doesn't yet exist
if (!fs.existsSync(baseDirectory + 'regionsGeoNewNameEdited'))
	fs.mkdirSync(baseDirectory + 'regionsGeoNewNameEdited');

/***** Pre-processing to get data *****/
function getFilenames()
{
	fs.readdir(baseDirectory + 'regionsGeoPopulation/', function(err, items)
	{
		for (var i=0; i<items.length; i++)
		{
			var areaFileToRead = "spain." + items[i];
			if (areaFileToRead == "spain.catalunya_girona.json")
				areaFileToRead = "spain.cataluna_girona.json";
			else if (areaFileToRead == "spain.catalunya_barcelona.json")
				areaFileToRead = "spain.cataluna_barcelona.json";
			else if (areaFileToRead == "spain.navarra_navarra.json")
				areaFileToRead = "spain.comunidad_foral_de_navarra_navarra.json";
			else if (areaFileToRead == "spain.catalunya_lleida.json")
				areaFileToRead = "spain.cataluna_lleida.json";
			else if (areaFileToRead == "spain.catalunya_tarragona.json")
				areaFileToRead = "spain.cataluna_tarragona.json";
			else if (areaFileToRead == "spain.ceuta_ceuta.json")
				areaFileToRead = "spain.ceuta_y_melilla_ceuta.json";
			else if (areaFileToRead == "spain.euskadi_araba.json")
				areaFileToRead = "spain.pais_vasco_alava.json";
			else if (areaFileToRead == "spain.euskadi_bizkaia.json")
				areaFileToRead = "spain.pais_vasco_vizcaya.json";
			else if (areaFileToRead == "spain.euskadi_gipuzkoa.json")
				areaFileToRead = "spain.pais_vasco_guipuzcoa.json";
			else if (areaFileToRead == "spain.illes_balears_illes_balears.json")
				areaFileToRead = "spain.islas_baleares_baleares.json";
			else if (areaFileToRead == "spain.melilla_melilla.json")
				areaFileToRead = "spain.ceuta_y_melilla_melilla.json";
			readArea(areaFileToRead, items[i]);
		}
	});
}

function readArea(areaFileToRead)
{
	fs.readFile(baseDirectory + 'regionsGeoNewNameEdited/' + areaFileToRead, 'utf8', function (err,data)
	{
		if (err)
			return console.log(err);
		var areasObj = JSON.parse(data);
		var needsAdmin3 = false;
		areasObj["features"].forEach(function(areaElem, areaIndex, areaArr)
		{
			if (areaElem.properties.NAME_3.substring(0, 4) == "n.a.")
			{
				needsAdmin3 = true;
				//console.log(areaElem.properties.NAME_1);
				//console.log(areaElem.properties.NAME_2);
				//console.log(areaElem.properties.NAME_3);
			}
		});
		if (needsAdmin3)
			console.log(areaFileToRead);
	});
}



/***** Main *****/
getFilenames();
/***** End main *****/
