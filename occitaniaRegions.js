var regionFuncs = new function()
{
	this.init = function(mapCountry, regionID, subregionID)
	{
		var mapStr = "maps/" + mapCountry + "/regions/" + mapCountry + "." + subregionID + ".topo.json";
		console.log(mapStr);
		d3.json(mapStr, function(error, regionTopoJson)
		{
			var regions = topojson.feature(regionTopoJson, regionTopoJson.objects.region);

			//var center = path.centroid(regions);
			var newProjection = d3.geo.albers()
				.center([0, 43.96])
				.rotate([1, 0.37])
				.parallels([50, 60])
				.scale(1200 * 4)
				.translate([600, 630]);

			var newPath = d3.geo.path().projection(newProjection);
			newProjection
				.scale(1)
				.translate([0, 0]);

			var windowWidth = window.innerWidth - 20,
			windowHeight = window.innerHeight - 20;
			var b = newPath.bounds(regions),
				s = .95 / Math.max((b[1][0] - b[0][0]) / windowWidth, (b[1][1] - b[0][1]) / windowHeight),
				t = [(windowWidth - s * (b[1][0] + b[0][0])) / 2, (windowHeight - s * (b[1][1] + b[0][1])) / 2];

			newProjection
				.scale(s)
				.translate(t);
			//console.log(d3.geo.centroid(regionTopoJson));
			//http://bl.ocks.org/mbostock/4707858


			// Color each region based on country
			// See "Area coloring" in the styles above
			var regionSVG = d3.select("#openRegion").append("svg")
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
				.on('mouseover', function(d){
					// Put region and subregion name in top corner
					$('#regionName').html(d.properties.regionname);
					$('#subRegionName').html(d.properties.subregionname);
					// Andorra, and possibly other small countries, don't have admin3
					if ("admin3name" in d.properties)
						$('#subSubRegionName').html(d.properties.admin3name);
				})
				.on('click', function(d){
					;
				});
			//console.log(regionTopoJson);
			//svg.append("path")
			//var regionSvg = d3.select("#" + currentFullRegion);
		/*	var regionSvg = d3.select("#openWindow");
			regionSvg.append("path")
				.datum(topojson.feature(regionTopoJson, regionTopoJson.objects.alsace))
				.attr("d", regionPath)
				.attr("class", "place");
							.data(topojson.feature(occitania, occitania.objects.subunits).features)
			.enter().append("path")
			.attr("class", function(d) { return "subunit " + d.id; })
			.attr("d", path);

		regionSvg.selectAll(".region")
			.data(topojson.feature(regionTopoJson, regionTopoJson.objects.region).features)
			.enter()
			.append("path")
			.filter(function(d) { return d.properties.population > 5000 })
			.attr("class", "place")
			.attr("d", regionPath);

			regionSvg.append("path")
				.datum(topojson.feature(regionTopoJson, regionTopoJson.objects.alsace))
				.filter(function(d) { console.log(d); return d.properties.population > 10000 })
				.attr("d", regionPath)
				.attr("class", "place");

			regionSvg
				.data(topojson.feature(regionTopoJson, regionTopoJson.objects.alsace).features)
				.enter().append("text")
				.attr("class", "place-label")
				.attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
				.attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
				.attr("dy", ".35em")
				.style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
				.text(function(d) { return d.geometry.id; });

				.data(topojson.feature(regionTopoJson, regionTopoJson.objects.alsace).features)
				.enter()
				.append("path")
				.attr("d", function(d) { console.log(d); return regionPath;})
				.attr("class", "place");
			d3.select("#openWindowGroup")
				.append("text")
				.text(function(d){return "My country, 'tis of thee, Sweet land of liberty, Of thee I sing; Land where my fathers died, Land of the pilgrims' pride, From ev'ry mountainside Let freedom ring!";});
*/
		});
	}
};
