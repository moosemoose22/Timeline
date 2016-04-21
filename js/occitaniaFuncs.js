// Variable declarations
var transitionEndName;
var currentRegion, currentFullRegion;
var currentLeftOffset, currentTopOffset, currentScaling;

function convertRegionName(regionname)
{
	var convertRegionObj = {};
	convertRegionObj["pais_vasco"] = "euskadi";
	convertRegionObj["comunidad_foral_de_navarra"] = "navarra";
	convertRegionObj["principado_de_asturias"] = "asturias";
	convertRegionObj["ceuta_y_melilla"] = "ceuta";
	convertRegionObj["cataluna"] = "catalunya";
	convertRegionObj["castile_and_leon"] = "castilla_y_leon";
	convertRegionObj["islas_baleares"] = "illes_balears";
	
	if (regionname in convertRegionObj)
		return convertRegionObj[regionname];
	else
		return regionname;
}

function convertSubRegionName(subregionname)
{
	var convertSubRegionObj = {};
	convertSubRegionObj["alava"] = "araba";
	convertSubRegionObj["guipuzcoa"] = "gipuzkoa";
	convertSubRegionObj["vizcaya"] = "bizkaia";
	convertSubRegionObj["baleares"] = "illes_balears";
	
	if (subregionname in convertSubRegionObj)
		return convertSubRegionObj[subregionname];
	else
		return subregionname;
}

// Convert coordinates in topojson file to screen coordinates
function getLargeMapCoords(mapPoints, position)
{
	var XCoord = 0, YCoord = 0;
	position = position ? position : "topleft";
	if (position == "topleft")
	{
		XCoord = d3.min(mapPoints.map(function(array) {
			return array[0];
		}));
		YCoord = d3.max(mapPoints.map(function(array) {
			return array[1];
		}));
	}
	else if (position == "bottomright")
	{
		XCoord = d3.max(mapPoints.map(function(array) {
			return array[0];
		}));
		YCoord = d3.min(mapPoints.map(function(array) {
			return array[1];
		}));
	}
	return [XCoord, YCoord];
}

// Open region detail window when clicking on region on map
var windowManager = new function()
{
	this.openRegionWindow = function(mapCountry, data)
	{
		calledRegionOpen = true;
		var id = mapCountry + "_" + data.properties.regionname + "_" + data.properties.subregionname;
		console.log(convertID(data.properties.regionname + "_" + data.properties.subregionname));
		id = convertID(id);
		currentRegion = data.properties.regionname;
		currentFullRegion = id;

		// Stolen from http://bl.ocks.org/mbostock/4707858
		var screenWidth = window.innerWidth - 20;
		var screenHeight = window.innerHeight - 20;
		var b = path.bounds(data),
			s = .95 / Math.max((b[1][0] - b[0][0]) / screenWidth, (b[1][1] - b[0][1]) / screenHeight),
			t = [(screenWidth - s * (b[1][0] + b[0][0])) / 2, (screenHeight - s * (b[1][1] + b[0][1])) / 2];
		currentLeftOffset = t[0];
		currentTopOffset = t[1];
		currentScaling = s;

		if (mapCountry == "spain" || mapCountry == "france" || mapCountry == "andorra")
		{
			var regionName = convertID(latinize(data.properties.regionname).toLowerCase());
			var subRegionName = convertID(latinize(data.properties.subregionname).toLowerCase());
			regionFuncs.init(mapCountry, data.properties.regionID, convertRegionName(regionName) + "_" + convertSubRegionName(subRegionName));
		}

		var countryAbbrev = data.properties.region;
		if (countryAbbrev.indexOf(".") !== -1)
		{
			var tmp = countryAbbrev.split(".");
			countryAbbrev = tmp[0];
		}
		$("#openRegionBG").html('<g id="regionZoomAnimationContainer"></g>');

		// Clone current region and attach it to regionZoomAnimationContainer
		$( "#" + currentFullRegion )
			.clone()
			.prop('id', currentFullRegion + "_copy" )
			.removeClass("region" )
			.addClass("regionLarge" )
			.addClass(countryAbbrev) // add country-specific background to region zoom svg
			.appendTo( "#regionZoomAnimationContainer" );

		$("#openRegionBG")
			.css("z-index", "100");

		// Here we simultaneously scale and move the region
		// so that the most western and northern points are near 0,0.
		// Note that the animation happens because of the openWindowStyle animation CSS
		// defined in occitaniaStyles.css
		// Also: we need to use translate below instead of changing css's left and top.
		// Translate has much faster animations, especially in Chrome
		// .2 is quasi-offset for stroke-width
		$("#openRegionBG")
			.css("animation-duration", "1.5s")
			.css("-webkit-animation-duration", "1.5s")
			.css("transform", "translate(" + currentLeftOffset + "px," + currentTopOffset + "px) scale(" + currentScaling + ")");
		var closeButtonWidth = $("#closeButtonObj").width();
		$("#closeButtonObj").css("display", "inline").css("right", closeButtonWidth);
	}

	// Called when user clicks on close button on top right
	// of region detail window
	this.closeWindowPrelim = function()
	{
		calledRegionPrelimClose = true;
		$(".openRegionStyle").css("z-index", "-1").css("visibility", "hidden");
		$("#regionZoomAnimationContainer").css("visibility", "visible");
		$("#openRegionBG").css("background-color", "rgba(0,0,0,0.0)");
		$("#closeButtonObj").css("display", "none");
	}
	this.closeWindow = function()
	{
		calledRegionClose = true;
		$("#openRegionBG")
			.css("transform", "scale(1)")
			.css("transform", "translate(0px," + ($(window).scrollTop() * -1) + "px) scale(1)");
		$("#closeButtonObj").css("display", "none");
	}
}
