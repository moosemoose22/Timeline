// Variable declarations
var transitionEndName;
var calledRegionOpen, calledRegionPrelimClose, calledRegionClose, regionIsOpen;
var currentRegion, currentFullRegion;
var currentLeftOffset, currentTopOffset, currentScaling;

// Events and variables being set on load
window.onload = function()
{
	// Choose browser-specific name for end transition
	var transitions = {
		"transition"      : "transitionend",
		"OTransition"     : "oTransitionEnd",
		"MozTransition"   : "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
	}
	for (var t in transitions)
	{
		if (document.body.style[t] !== undefined)
			transitionEndName = transitions[t];
	}

	// When we finish closing a region window,
	// hide the old region 
	$("#openWindow")
		.on(transitionEndName, function(e){
			if (calledRegionPrelimClose)
			{
				regionIsOpen = false;
				calledRegionPrelimClose = false;
				closeWindow();
			}
			else if (calledRegionClose)
			{
				calledRegionClose = false;
				$("#openWindow").css("z-index", "-1");
				// Hide previously clicked region
				$( "#" + currentFullRegion + "_copy" ).remove();
			}
			else if (calledRegionOpen)
			{
				calledRegionOpen = false;
				regionIsOpen = true;
				$("#openWindow").css("background-color", "rgba(0,0,0,0.25)");
				//console.log(currentFullRegion);
			}
		});
	$(window).scroll(function()
	{
		if (!regionIsOpen)
		{
			$("#openWindow")
				.css("animation-duration", "0s")
				.css("-webkit-animation-duration", "0s")
				.css("transform", "translateY(" + ($(window).scrollTop() * -1) + "px)");
		}
	});
}

// We base IDs on region name
// Here we convert the region names to HTML-friendly strings
function convertID(oldID)
{
	oldID = latinize(oldID);
	oldID = oldID.replace(/ /g, "_");
	oldID = oldID.replace(/'/g, "_");
	return latinize(oldID);
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
function openRegionWindow(data)
{
	calledRegionOpen = true;
	var id = data.properties.regionname + "_" + data.properties.subregionname;
	id = convertID(id);
	currentRegion = data.properties.regionname;
	currentFullRegion = id;

	if (currentRegion == "Alsace")
		regionFuncs.init();

	var topleftCoordinates, bottomrightCoordinates;

	if (data.geometry.type == "Polygon")
	{
		var topleftCoords = getLargeMapCoords(data.geometry.coordinates[0], "topleft");
		var bottomrightCoords = getLargeMapCoords(data.geometry.coordinates[0], "bottomright");
		topleftCoordinates = projection(topleftCoords);
		bottomrightCoordinates = projection(bottomrightCoords);
	}
	else if (data.geometry.type == "MultiPolygon")
	{
		var XcoordArrTopleft = [];
		var YcoordArrTopleft = [];
		var XcoordArrBottomright = [];
		var YcoordArrBottomright = [];
		data.geometry.coordinates.forEach(function(coordArr)
		{
			var topleftCoords = getLargeMapCoords(coordArr[0], "topleft");
			XcoordArrTopleft.push(topleftCoords[0]);
			YcoordArrTopleft.push(topleftCoords[1]);
			var bottomrightCoords = getLargeMapCoords(coordArr[0], "bottomright");
			XcoordArrBottomright.push(bottomrightCoords[0]);
			YcoordArrBottomright.push(bottomrightCoords[1]);
		});
		var XcoordTopleft = d3.min(XcoordArrTopleft);
		var YcoordTopleft = d3.max(YcoordArrTopleft);
		var XcoordBottomright = d3.max(XcoordArrBottomright);
		var YcoordBottomright = d3.min(YcoordArrBottomright);
		topleftCoordinates = projection([XcoordTopleft, YcoordTopleft]);
		bottomrightCoordinates = projection([XcoordBottomright, YcoordBottomright]);
	}

	// Figure out which is the smallest increase that scales the svg to the max width or height of the screen
	var widthDiff = bottomrightCoordinates[0] - topleftCoordinates[0];
	var heightDiff = bottomrightCoordinates[1] - topleftCoordinates[1];
	var widthDimension = (window.innerWidth / widthDiff);
	var heightDimension = (window.innerHeight / heightDiff);
	currentScaling = (widthDimension > heightDimension) ? heightDimension : widthDimension;
	var centerRegionExtraPixels = (window.innerWidth - widthDiff) / currentScaling;
	// .1 is quasi-offset for some regions being too large
	currentScaling = currentScaling - currentScaling * .1;

	var countryAbbrev = data.properties.region;
	if (countryAbbrev.indexOf(".") !== -1)
	{
		var tmp = countryAbbrev.split(".");
		countryAbbrev = tmp[0];
	}

	$("#openWindow").html('<g id="openWindowGroup"></g>');

	$( "#" + currentFullRegion )
		.clone()
		.prop('id', currentFullRegion + "_copy" )
		.removeClass("region" )
		.addClass("regionLarge" )
		.addClass(countryAbbrev)
		.appendTo( "#openWindowGroup" );

	$("#openWindow")
		.css("z-index", "100");

	// Here we simultaneously scale and move the region
	// so that the most western and northern points are near 0,0.
	// Note that the animation happens because of the openWindowStyle animation CSS
	// defined in occitaniaStyles.css
	// Also: we need to use translate below instead of changing css's left and top.
	// Translate has much faster animations, especially in Chrome
	// .2 is quasi-offset for stroke-width
	currentLeftOffset = topleftCoordinates[0] * currentScaling * -1 + (currentScaling * .2) + centerRegionExtraPixels;
	currentTopOffset = topleftCoordinates[1] * currentScaling * -1 + (currentScaling * .2);
	$("#openWindow")
		.css("animation-duration", "1.5s")
		.css("-webkit-animation-duration", "1.5s")
		.css("transform", "translate(" + currentLeftOffset + "px," + currentTopOffset + "px) scale(" + currentScaling + ")");
	$("#closeButtonObj").css("display", "inline");
}

// Called when user clicks on close button on top right
// of region detail window
function closeWindowPrelim()
{
	calledRegionPrelimClose = true;
	$("#openWindow").css("background-color", "rgba(0,0,0,0.0)");
}
function closeWindow()
{
	calledRegionClose = true;
	$("#openWindow")
		.css("transform", "scale(1)")
		.css("transform", "translate(0px," + ($(window).scrollTop() * -1) + "px) scale(1)");
	$("#closeButtonObj").css("display", "none");
}
