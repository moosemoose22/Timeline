/********************
	A bunch of the subregions in Spain didn't have admin3 names
	Here we take the admin3 info from the google maps API
	and add it to the gadm admin3 info
********************/

fs = require('fs');
var cityFindFuncs = require('./cityFindFuncs.js');
var outputFilename = "regionsMissingCitiesFRA.csv";

fs.writeFile(outputFilename, "", function(err){
	if(err){console.log(err);}
});


/***** Post-processing to write back to file *****/
function postProcessing(areaFileToRead, areasObj)
{
	var regionsMissingCities = [];
	areasObj["features"].forEach(function(areaElem, areaIndex, areaArr)
	{
		if (!("has_point" in areasObj["features"][areaIndex].properties))
		{
			console.log(areasObj["features"][areaIndex].properties.NAME_1 + "," + areasObj["features"][areaIndex].properties.NAME_2 + "," + areasObj["features"][areaIndex].properties.NAME_3);
			regionsMissingCities.push(areasObj["features"][areaIndex].properties.NAME_1 + "," + areasObj["features"][areaIndex].properties.NAME_2 + "," + areasObj["features"][areaIndex].properties.NAME_3);
		}
	});
	for (var i=0; i < regionsMissingCities.length; i++)
		fs.appendFileSync(outputFilename, regionsMissingCities[i] + "\n");    
}
/***** End post-processing to write back to file *****/

/***** Main *****/
var requiredData = {
	action: "find",
	baseDirectory: "../individuals/france/",
	country: "france",
	callback: postProcessing
};
cityFindFuncs.getFilenames(requiredData);
/***** End main *****/
