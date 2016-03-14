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
			regionSvg.append("path")
				.datum(topojson.feature(regionTopoJson, regionTopoJson.objects.alsace))
				.attr("d", regionPath)
				.attr("class", "place");
		});
	}
};
