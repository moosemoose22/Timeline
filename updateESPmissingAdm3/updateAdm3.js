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
// Get correct population file name, then pass name to next stage
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

// Get correct area file name, then pass area and population file names to next stage
function readArea(areaFileToRead, cityFileToRead)
{
	fs.readFile(baseDirectory + 'regionsGeoNewName/' + areaFileToRead, 'utf8', function (err,data)
	{
		if (err)
			return console.log(err);
		var areasObj = JSON.parse(data);
		//var areas = areasObj["features"];
		readCities(areaFileToRead, cityFileToRead, areasObj);
	});
}

// First read in cities that match this region
function readCities(areaFileToRead, cityFileToRead, areasObj)
{
	fs.readFile(baseDirectory + 'regionsGeoPopulation/' + cityFileToRead, 'utf8', function (err,data)
	{
		if (err)
			return console.log(err);
		obj = JSON.parse(data);
		var cities = obj["features"];
		findCitiesInAreaPrelim(areaFileToRead, areasObj, cities);
	});
}

// GeoJSON has polygons and multi-polygons.
// If your area is apolygon, we call findCitiesInArea once.
// Otherwise, we call findCitiesInArea for each polygon in the multi-polygon.
function findCitiesInAreaPrelim(areaFileToRead, areasObj, cities)
{
	areasObj["features"].forEach(function(areaElem, areaIndex, areaArr)
	{
		if (areaElem.geometry.type == "Polygon")
			findCitiesInArea(areaElem.geometry.coordinates, areaIndex, areasObj, cities);
		else if(areaElem.geometry.type == "MultiPolygon")
		{
			areaElem.geometry.coordinates.forEach(function(coordElem, coordIndex, coordArray)
			{
				findCitiesInArea(coordElem, areaIndex, areasObj, cities);
			});
		}
	});
	postProcessing(areaFileToRead, areasObj);
}
/***** End pre-processing to get data *****/


/***** Processing to find city in area *****/
function isPointInPoly(poly, pt)
{
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1]))
		&& (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
		&& (c = !c);
	return c;
}

var counter = 0;
// Here's where we actually find a city in a region!
// If the city is in this region, we update the admin3 data for the region
function findCitiesInArea(geom, areaIndex, areasObj, cities)
{
	cities.forEach(function(cityElem, cityIndex, cityArr)
	{
		counter += 1;
		var hasPoint = isPointInPoly(geom[0], cityElem.geometry.coordinates);
		if (hasPoint)
		{
			console.log(areaIndex + ") " + cityElem.properties.RegionName + " " + cityElem.properties.DeptName + " " + cityElem.properties.Admin3Name + " " + cityElem.properties.CityName);
			areasObj["features"][areaIndex].properties.NAME_3 = cityElem.properties.Admin3Name;
		}
	});
}
/***** End processing to find city in area *****/


/***** Post-processing to write back to file *****/
function postProcessing(areaFileToRead, areasObj)
{
	var outputFilename = baseDirectory + 'regionsGeoNewNameEdited/' + areaFileToRead;
	fs.writeFile(outputFilename, JSON.stringify(areasObj, null, 4), function(err)
	{
		if (err)
			console.log(err);
		else
			console.log("JSON saved to " + outputFilename);
	});
}
/***** End post-processing to write back to file *****/


/***** Main *****/
getFilenames();
/***** End main *****/
