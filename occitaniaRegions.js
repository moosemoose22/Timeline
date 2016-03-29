var regionFuncs = new function()
{
	var mapStr = "maps/france/alsace.topo.json";
	this.init = function()
	{
		d3.json(mapStr, function(error, regionTopoJson)
		{
			//console.log(regionTopoJson);
			//svg.append("path")
			//var regionSvg = d3.select("#" + currentFullRegion);
			var regionSvg = d3.select("#openWindow");
		/*	regionSvg.append("path")
				.datum(topojson.feature(regionTopoJson, regionTopoJson.objects.alsace))
				.attr("d", regionPath)
				.attr("class", "place");
							.data(topojson.feature(occitania, occitania.objects.subunits).features)
			.enter().append("path")
			.attr("class", function(d) { return "subunit " + d.id; })
			.attr("d", path);
*/
		regionSvg.selectAll(".alsaceCity")
			.data(topojson.feature(regionTopoJson, regionTopoJson.objects.alsace).features)
			.enter()
			.append("path")
			.filter(function(d) { return d.properties.population > 5000 })
			.attr("class", "place")
			.attr("d", regionPath);

/*			regionSvg.append("path")
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
