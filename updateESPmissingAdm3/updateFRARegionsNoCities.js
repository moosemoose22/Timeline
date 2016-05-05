var lineCount;

// Find the 
const exec = require('child_process').exec;
const child = exec('nodejs findFRARegionsNoCities.js',
	(error, stdout, stderr) => {
		checkMissingCitiesWordCount();
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
	}
);

function checkMissingCitiesWordCount()
{
	const child = exec('wc -l regionsMissingCitiesFRA.csv',
		(error, stdout, stderr) => {
			var outputArr = stdout.split(" ");
			lineCount = outputArr[0];
			readFiles(lineCount);
			if (error !== null) {
				console.log(`exec error: ${error}`);
			}
		}
	);
}

var fs = require('fs');
var latinize = require('../js/latinize.js');
var cityFindFuncs = require('./cityFindFuncs.js');

var allNewCities = {};
var regionsMissingCities = {};
var baseDirectory = "../individuals/france/";

// From wikipedia: In 2014, the French parliament passed a law reducing the number of metropolitan regions from 22 to 13
// Since gadm uses the old names,
// we need to convert from the new names obtained from google geocoding API to the old names which we used to name the population files
// These names will continue to change throughout 2016, so this will need to be updated if we refresh the data after the name change takes effect.
var convertNewFranceRegions = {};
convertNewFranceRegions["aquitaine_limousin_poitou-charentes"] = ["aquitaine", "limousin", "poitou-charentes"];
convertNewFranceRegions["normandie"] = ["haute-normandie", "basse-normandie"];
convertNewFranceRegions["bourgogne_franche-comte"] = ["bourgogne", "franche-comte"];
convertNewFranceRegions["auvergne_rhone-alpes"] = ["auvergne", "rhone-alpes"];
convertNewFranceRegions["nord-pas-de-calais_picardie"] = ["nord-pas-de-calais", "picardie"]; // using interim region name
convertNewFranceRegions["hauts-de-france"] = ["nord-pas-de-calais", "picardie"]; // using final region name
convertNewFranceRegions["languedoc-roussillon_midi-pyrenees"] = ["languedoc-roussillon", "midi-pyrenees"];
convertNewFranceRegions["alsace-champagne-ardenne-lorraine"] = ["alsace", "champagne-ardenne", "lorraine"];
convertNewFranceRegions["centre-val_de_loire"] = ["centre"];
// The following regions havent had their names changed:
// ile de france, bretagne, Pays de la Loire, provence-alpes-cote_d_azur

function convertName(name)
{
	name = name.replace(/ /g, "_");
	name = name.replace(/'/g, "_");
	name = name.toLowerCase();
	name = latinize(name);
	return name;
}


function readFiles(lineCount)
{
	var lineReader = require('readline').createInterface({
		input: require('fs').createReadStream("regionsMissingCitiesFRA.csv")
	});

	var franceListCounter = 0;
	lineReader.on('line', function (line) {
		franceListCounter++;
		var placeArr = line.split(",");
		var missingRegionName = convertName(placeArr[0]);
		var missingDeptName = convertName(placeArr[1]);
		if (!(missingRegionName in regionsMissingCities))
			regionsMissingCities[missingRegionName] = {};
		if (!(missingDeptName in regionsMissingCities[missingRegionName]))
			regionsMissingCities[missingRegionName][missingDeptName] = [];
		var admin3Name;
		// Takes care of situation when there's a comma in the admin3 name
		// such as "Paris, 11e arrondissement"
		for (var x = 2; x < placeArr.length; x++)
		{
			if (!admin3Name)
				admin3Name = placeArr[x];
			else
				admin3Name += ("," + placeArr[x]);
		}
		regionsMissingCities[missingRegionName][missingDeptName].push(admin3Name);
		if (franceListCounter == lineCount)
			readNewCities();
	});
}

function readNewCities()
{
	var data = fs.readFileSync("france1000to10000.geo.json", 'utf8');
	var citiesObj = JSON.parse(data);
	citiesObj["features"].forEach(function(cityElem, areaIndex, areaArr)
	{
		var adm1Obj;
		var regionName = convertName(cityElem.properties.RegionName);
		var deptName = convertName(cityElem.properties.DeptName);
		if (!(regionName in allNewCities))
			allNewCities[regionName] = {};
		adm1Obj = allNewCities[regionName];
		if (!(deptName in adm1Obj))
			adm1Obj[deptName] = {};
		adm2Obj = adm1Obj[deptName];
		if (!("cityList" in adm2Obj))
			adm2Obj.cityList = [];
		adm2Obj.cityList.push(cityElem);
	});
	getFileNamesForCity();
}

// We've read in all admin 1 and admin2 regions that have admin3 areas which are missing cities.
// We've also read in all the cities that have a population between 1000 and 10000.
// How do we add these new cities to the map?
// First we map the new region to the correct old region.
// Loop through the old regions and check to see which 
function getFileNamesForCity()
{
	for (var x in allNewCities)
	{
		for (var y in allNewCities[x])
		{
			allNewCities[x][y].cityList.forEach(function(cityElem)
			{
				var newRegionName = convertName(cityElem.properties.RegionName);
				var deptName = convertName(cityElem.properties.DeptName);
				var finalRegionName;
				var populationFileName;
				if (newRegionName in convertNewFranceRegions)
				{
					// loop through all possible old regions for correct old region name
					convertNewFranceRegions[newRegionName].forEach(function(oldRegionName, index, arr)
					{
						if (oldRegionName in regionsMissingCities && deptName in regionsMissingCities[oldRegionName])
						{
							finalRegionName = oldRegionName;
							populationFileName = oldRegionName + "_" + deptName + ".json";
						}
					});
				}
				else
				{
					finalRegionName = newRegionName;
					populationFileName = newRegionName + "_" + deptName + ".json";
				}
				if (finalRegionName in regionsMissingCities)
				{
					if (deptName in regionsMissingCities[finalRegionName])
					{
						var areaFileName = cityFindFuncs.getFileName(populationFileName, {country: "france"});
						findCityInEmptyArea(areaFileName, populationFileName, cityElem);
					}
				}
			});
		}
	}
}

function findCityInEmptyArea(areaFileName, populationFileName, cityElem)
{
	var data = fs.readFileSync(baseDirectory + 'regionsGeoNewName/' + areaFileName, 'utf8');
	var areasObj = JSON.parse(data);
	areasObj["features"].forEach(function(areaElem, areaIndex, areaArr)
	{
		if (areaElem.geometry.type == "Polygon")
			findCity(areaElem.geometry.coordinates, areaElem, cityElem, populationFileName);
		else if(areaElem.geometry.type == "MultiPolygon")
		{
			areaElem.geometry.coordinates.forEach(function(coordElem, coordIndex, coordArray)
			{
				findCity(coordElem, areaElem, cityElem, populationFileName);
			});
		}
	});
}

function findCity(geom, areaElem, cityElem, populationFileName)
{
	var admin3NameFound = "";
	var admin1AreaName = convertName(areaElem.properties.NAME_1);
	var admin2AreaName = convertName(areaElem.properties.NAME_2);
	var admin3AreaName = convertName(areaElem.properties.NAME_3);
	regionsMissingCities[admin1AreaName][admin2AreaName].forEach(function(admin3Name, index, array)
	{
		if (convertName(admin3Name) == admin3AreaName)
			admin3NameFound = admin3AreaName;
	});
	if (admin3NameFound != "")
	{
		var hasPoint = cityFindFuncs.isPointInPoly(geom[0], cityElem.geometry.coordinates);
		if (hasPoint)
		{
			var regionArr = regionsMissingCities[admin1AreaName][admin2AreaName];
			var finalArray;
			for (var x = 0; x < regionArr.length; x++)
			{
				if (convertName(regionArr[x]) == admin3NameFound)
				{
					var firstPart = regionArr.slice(0, x);
					var secondPart = regionArr.slice(x + 1);
					finalArray = firstPart.concat(secondPart);
				}
			}

			if (finalArray)
				regionsMissingCities[admin1AreaName][admin2AreaName] = finalArray;
			var populationFullPath = baseDirectory + 'regionsGeoPopulation/' + populationFileName;
			var data = fs.readFileSync(populationFullPath, 'utf8');
			var populationObj = JSON.parse(data);
			populationObj["features"].push(cityElem);
			fs.writeFileSync(populationFullPath, JSON.stringify(populationObj, null, 4));
			console.log(cityElem.properties.CityName + " JSON saved to " + populationFullPath + " for " + admin3NameFound + " admin3 region.");
		}
	}
}

