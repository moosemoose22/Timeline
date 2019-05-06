var regionFuncs = new function()
{
	var regionSVG;
	var populationJSON;
	var newPath;
	var newProjection;

	this.init = function(mapCountry, regionID, subregionID, callback)
	{
		var mapStr = "maps/" + mapCountry + "/regions/" + mapCountry + "." + subregionID + ".topo.json";
		console.log(mapStr);
		d3.json(mapStr, function(error, regionTopoJson)
		{
			var windowWidth = window.innerWidth - 20,
			windowHeight = window.innerHeight - 20;

			var regions = topojson.feature(regionTopoJson, regionTopoJson.objects.region);
			if ("population" in regionTopoJson.objects)
				populationJSON = topojson.feature(regionTopoJson, regionTopoJson.objects.population);

			var scaleOverride, finaTopOffset;
			if (mapCountry == "spain" && (subregionID == "andalucia_almeria" || subregionID == "ceuta_ceuta"))
			{
				var topleftCoordinates, bottomrightCoordinates;

				regions.features.forEach(function(element, index, array)
				{
					if (element.geometry.type == "Polygon")
					{
						var topleftCoords = getLargeMapCoords(element.geometry.coordinates[0], "topleft");
						var bottomrightCoords = getLargeMapCoords(element.geometry.coordinates[0], "bottomright");
						topleftCoordinates = projection(topleftCoords);
						bottomrightCoordinates = projection(bottomrightCoords);
					}
					else if (element.geometry.type == "MultiPolygon")
					{
						var XcoordArrTopleft = [];
						var YcoordArrTopleft = [];
						var XcoordArrBottomright = [];
						var YcoordArrBottomright = [];
						element.geometry.coordinates.forEach(function(coordArr)
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
					var widthDimension = (windowWidth / widthDiff);
					var heightDimension = (windowHeight / heightDiff);
					var tempFinalDimension = (widthDimension > heightDimension) ? heightDimension : widthDimension;
					if (typeof scaleOverride == "undefined")
						scaleOverride = tempFinalDimension;
					else
						scaleOverride = (scaleOverride > tempFinalDimension) ? tempFinalDimension : scaleOverride;
					var centerRegionExtraPixels = (window.innerWidth - widthDiff) / tempFinalDimension;
					var centerRegionExtraPixels = (window.innerWidth - widthDiff) / currentScaling;
					// .1 is quasi-offset for some regions being too large
				//	currentScaling = currentScaling - currentScaling * .1;

					// Here we simultaneously scale and move the region
					// so that the most western and northern points are near 0,0.
					// Note that the animation happens because of the openWindowStyle animation CSS
					// defined in occitaniaStyles.css
					// Also: we need to use translate below instead of changing css's left and top.
					// Translate has much faster animations, especially in Chrome
					// .2 is quasi-offset for stroke-width
					//currentLeftOffset = topleftCoordinates[0] * currentScaling * -1 + (currentScaling * .2) + centerRegionExtraPixels;
					//currentTopOffset = topleftCoordinates[1] * currentScaling * -1 + (currentScaling * .2);
					if (typeof finaTopOffset == "undefined")
						finaTopOffset = topleftCoordinates[1];
					else
						finaTopOffset = (topleftCoordinates[1] < finaTopOffset) ? topleftCoordinates[1] : finaTopOffset;
				});
			/*
				regionTopoJson.objects.region.geometries.forEach(function(element, index, array)
				{
					element.arcs.forEach(function(subelement, subindex, subarray)
					{
						;//subelement.reverse();
					});
				});
				
				regions.features.forEach(function(element, index, array)
				{
					console.log(d3.geo.area(element));
					if (d3.geo.area(element) == 0)
						console.log("Found one!!");
					/*element.geometry.coordinates.forEach(function(subelement, subindex, subarray)
					{
						subelement.reverse();
					});
				});
			*/
			}

			//var center = path.centroid(regions);
			newProjection = d3.geo.albers()
				.center([0, 43.96])
				.rotate([1, 0.37])
				.parallels([50, 60]);

			newPath = d3.geo.path().projection(newProjection).pointRadius(2.4);
			newProjection
				.scale(1)
				.translate([0, 0]);

			var b = newPath.bounds(regions);
			if (typeof scaleOverride != "undefined")
				s = (scaleOverride * 1000 * 4); // Why do these magic numbers work for Almeria? They don't work for Ceuta, probably because it includes Melilla.
			else
				s = .95 / Math.max((b[1][0] - b[0][0]) / windowWidth, (b[1][1] - b[0][1]) / windowHeight);
			if (typeof scaleOverride != "undefined")
			{
				//console.log(currentScaling);
				var theirS = .95 / Math.max((b[1][0] - b[0][0]) / windowWidth, (b[1][1] - b[0][1]) / windowHeight);
				t = [(windowWidth - s * (b[1][0] + b[0][0])) / 2, (windowHeight * ( s / theirS) - s * (b[1][1] + b[0][1])) / 2];
			}
			else
				t = [(windowWidth - s * (b[1][0] + b[0][0])) / 2, (windowHeight - s * (b[1][1] + b[0][1])) / 2];

			newProjection
				.scale(s)
				.translate(t);
			//console.log(d3.geo.centroid(regionTopoJson));
			//http://bl.ocks.org/mbostock/4707858


			// Color each region based on country
			// See "Area coloring" in the styles above
			regionSVG = d3.select("#openRegionContainer").append("svg")
				.attr("width", windowWidth)
				.attr("height", windowHeight)
				.attr("id", "regionMap");
			//.attr("visibility", "hidden");

			regionSVG.selectAll(".subsubregionColor")
				.data(topojson.feature(regionTopoJson, regionTopoJson.objects.region).features)
				.enter().append("path")
				.attr("class", function(d) { return "subunit " + mapCountry; })
				.attr("d", newPath);

			regionSVG.selectAll('.subsubregionArea')
				.data(topojson.feature(regionTopoJson, regionTopoJson.objects.region).features)
				.enter()
				.append('path')
				.attr('class', 'region')
				.attr('d', newPath)
				.attr("id", function (d){
					var id = d.properties.regionname + "_" + d.properties.subregionname;
					id = convertID(id);
					return id;
				})
				.on('mouseover', function(d)
				{
					var admin3Name;
					// Andorra, and possibly other small countries, don't have admin3
					if ("admin3name" in d.properties)
					{
						admin3Name = d.properties.admin3name;
						//if (d.properties.admin3name.substring(0, 4) == "n.a.")
					}
					else
						admin3Name = undefined;
					selectedRegionManager.select(d.properties.regionname, d.properties.subregionname, admin3Name);
					selectedRegionManager.writeData();
				})
				.on('click', function(d){
					;
				});
			if (callback)
				callback();
		});
	}

	this.addCities = function()
	{
		if (!(populationJSON && "features" in populationJSON))
			return;
		console.log(populationJSON);
		var myRegionTextLabelGroups = regionSVG.selectAll(".region-place-label")
			.data(populationJSON.features)
			.enter()
			.append("g");

		// Add little gray dot next to city
		myRegionTextLabelGroups.append("path")
			.attr("d", newPath)
			.attr("class", "place")
			.on('mouseover', function(d)
			{
				selectedRegionManager.select(d.properties.populregionname, d.properties.populsubregionname, undefined, d.properties.cityname, d.properties.population.toLocaleString());
				selectedRegionManager.writeData();
				$(this.nextSibling.nextSibling).css("fill-opacity", 0.1);
			})
			.on('mouseout', function(d)
			{
				$(this.nextSibling.nextSibling).css("fill-opacity", 0.01);
			});

		myRegionTextLabelGroups.append("text")
			.attr("class", "place-label")
			.attr("transform", function(d) { return "translate(" + newProjection(d.geometry.coordinates) + ")"; })
			.attr("x", function(d) {
				if (d.properties.textPosition == "default")
					return d.geometry.coordinates[0] > -1 ? 6 : -6;
				else
					return (d.properties.textPosition == "left") ? -6 : 6;
			})
			.attr("dy", ".35em")
			.style("text-anchor", function(d) {
				if (d.properties.textPosition == "default")
					return d.geometry.coordinates[0] > -1 ? "start" : "end";
				else
					return (d.properties.textPosition == "left") ? "end" : "start";
			})
			.text(function(d) { return d.properties.cityname; });

		// City hover background rectangle
		myRegionTextLabelGroups.append("rect")
			.attr("class", "place-label-bg")
			.attr("transform", function(d)
			{
				var bbox = this.previousSibling.getBBox();
				var coords = newProjection(d.geometry.coordinates);
				var addPixels;
				if (d.properties.textPosition == "default")
					addPixels = (d.geometry.coordinates[0] > -1);
				else
					addPixels = (d.properties.textPosition == "right");
				if (addPixels)
					coords[0] += 6;
				else
					coords[0] -= (bbox.width + 6);
				coords[1] -= (bbox.height / 2);
				return "translate(" + coords + ")";
			})
			.attr("width", function(d)
			{
				var bbox = this.previousSibling.getBBox();
				return bbox.width;
			})
			.attr("height", function(d)
			{
				var bbox = this.previousSibling.getBBox();
				return bbox.height;
			})
			.style("fill-opacity", 0.01)
			.on('mouseover', function(d)
			{
				selectedRegionManager.select(d.properties.populregionname, d.properties.populsubregionname, undefined, d.properties.cityname, d.properties.population.toLocaleString());
				selectedRegionManager.writeData();
				$(this).css("fill-opacity", 0.1);
			})
			.on('mouseout', function(d)
			{
				$(this).css("fill-opacity", 0.01);
			});
	}

	this.setPopulationJSON = function(newPopulationJSON)
	{
		populationJSON = newPopulationJSON;
	}

	this.reset = function()
	{
		regionSVG = null;
		populationJSON = null;
		newPath = null;
		newProjection = null;
	}
};
