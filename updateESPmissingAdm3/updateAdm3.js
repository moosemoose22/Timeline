/********************
	A bunch of the subregions in Spain didn't have admin3 names
	Here we take the admin3 info from the google maps API
	and add it to the gadm admin3 info
********************/

fs = require('fs');
var cityFindFuncs = require('./cityFindFuncs.js');
var baseDirectory = "../individuals/spain/";

// create directory where we'll write new files if it doesn't yet exist
if (!fs.existsSync(baseDirectory + 'regionsGeoNewNameEdited'))
	fs.mkdirSync(baseDirectory + 'regionsGeoNewNameEdited');

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
var requiredData = {
	action: "update",
	baseDirectory: "../individuals/spain/",
	country: "spain",
	callback: postProcessing
};
cityFindFuncs.getFilenames(requiredData);
/***** End main *****/
