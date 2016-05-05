module.exports = {
	requiredDataExample: {
		action: "",
		baseDirectory: "",
		country: "",
		callback: null
	},

	/***** Pre-processing to get data *****/
	// Get correct population file name, then pass name to next stage
	getFileName: function(populationName, requiredData)
	{
		var areaFileToRead = requiredData.country + "." + populationName;
		if (requiredData.country == "spain")
		{
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
		}
		return areaFileToRead;
	},

	getFilenames: function(requiredData)
	{
		fs.readdir(requiredData.baseDirectory + 'regionsGeoPopulation/', function(err, items)
		{
			for (var i=0; i<items.length; i++)
			{
				var areaFileToRead = module.exports.getFileName(items[i], requiredData);
				module.exports.readArea(areaFileToRead, items[i], requiredData);
			}
		});
	},

	// Get correct area file name, then pass area and population file names to next stage
	readArea: function(areaFileToRead, cityFileToRead, requiredData)
	{
		fs.readFile(requiredData.baseDirectory + 'regionsGeoNewName/' + areaFileToRead, 'utf8', function (err,data)
		{
			if (err)
				return console.log(err);
			var areasObj = JSON.parse(data);
			//var areas = areasObj["features"];
			module.exports.readCities(areaFileToRead, cityFileToRead, areasObj, requiredData);
		});
	},

	// First read in cities that match this region
	readCities: function(areaFileToRead, cityFileToRead, areasObj, requiredData)
	{
		fs.readFile(requiredData.baseDirectory + 'regionsGeoPopulation/' + cityFileToRead, 'utf8', function (err,data)
		{
			if (err)
				return console.log(err);
			obj = JSON.parse(data);
			var cities = obj["features"];
			module.exports.findCitiesInAreaPrelim(areaFileToRead, areasObj, cities, requiredData);
		});
	},

	// GeoJSON has polygons and multi-polygons.
	// If your area is apolygon, we call findCitiesInArea once.
	// Otherwise, we call findCitiesInArea for each polygon in the multi-polygon.
	findCitiesInAreaPrelim: function(areaFileToRead, areasObj, cities, requiredData)
	{
		areasObj["features"].forEach(function(areaElem, areaIndex, areaArr)
		{
			if (areaElem.geometry.type == "Polygon")
				module.exports.findCitiesInArea(areaElem.geometry.coordinates, areaIndex, areasObj, cities, requiredData);
			else if(areaElem.geometry.type == "MultiPolygon")
			{
				areaElem.geometry.coordinates.forEach(function(coordElem, coordIndex, coordArray)
				{
					module.exports.findCitiesInArea(coordElem, areaIndex, areasObj, cities, requiredData);
				});
			}
		});
		if ("callback" in requiredData && requiredData.callback)
			requiredData.callback(areaFileToRead, areasObj);
	},
	/***** End pre-processing to get data *****/


	/***** Processing to find city in area *****/
	// Here's where we actually find a city in a region!
	// If the city is in this region, we either
		// a) mark the city as found
		// b) update the admin3 data for the region
	findCitiesInArea: function(geom, areaIndex, areasObj, cities, requiredData)
	{
		cities.forEach(function(cityElem, cityIndex, cityArr)
		{
			var hasPoint = module.exports.isPointInPoly(geom[0], cityElem.geometry.coordinates);
			if (hasPoint)
			{
				if (requiredData.action == "find")
					areasObj["features"][areaIndex].properties.has_point = true;
				else if (requiredData.action == "update")
					areasObj["features"][areaIndex].properties.NAME_3 = cityElem.properties.Admin3Name;
			}
		});
	},
	/***** End processing to find city in area *****/


	/***** Take in a polygon and coordinates, see whether the coordinate is in the polygon *****/
	isPointInPoly: function (poly, pt) {
		for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
			((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1]))
			&& (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
			&& (c = !c);
		return c;
	},
	/***** End take in a polygon and coordinates, see whether the coordinate is in the polygon *****/
};
