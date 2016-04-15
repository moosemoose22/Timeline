var landingPage = new function()
{
	this.init = function()
	{
		// wait until map is drawn before writing cities
		this.writeMap("andorra");
		this.writeMap("monaco");
		this.writeMap("france");
		this.writeMap("spain", this.writeCities);
	}

	this.writeMap = function(mapCountry, callback)
	{
		console.log(mapCountry);
		var mapLoc;
		if (mapCountry == "andorra" || mapCountry == "monaco")
			mapLoc = "maps/" + mapCountry + "/" + mapCountry + ".adm0.topo.json";
		else
			mapLoc = "maps/" + mapCountry + "/" + mapCountry + ".adm2.topo.json";
		d3.json(mapLoc, function(error, newOccitania)
		{
			// Color each region based on country
			// See "Area coloring" in the styles above
			var topojsonObj;
			if ("admin2" in newOccitania.objects)
				topojsonObj = newOccitania.objects.admin2;
			else if ("admin1" in newOccitania.objects)
				topojsonObj = newOccitania.objects.admin1;
			else if ("admin0" in newOccitania.objects)
				topojsonObj = newOccitania.objects.admin0;
			svg.selectAll(".subunit" + mapCountry)
				.data(topojson.feature(newOccitania, topojsonObj).features)
				.enter().append("path")
				.attr("class", function(d) { return "subunit " + mapCountry; })
				.attr("d", path);

			svg.selectAll('.region' + mapCountry)
				.data(topojson.feature(newOccitania, topojsonObj).features)
				.enter()
				.append('path')
				.attr('class', 'region')
				.attr('d', path)
				.attr("id", function (d){
					var id = mapCountry + "_" + d.properties.regionname + "_" + d.properties.subregionname;
					id = convertID(id);
					return id;
				})
				.on('mouseover', function(d)
				{
					// Put region and subregion name in top corner
					selectedRegionManager.select(d.properties.regionname, d.properties.subregionname);
					selectedRegionManager.writeData();
				})
				.on('click', function(d){
					windowManager.openRegionWindow(mapCountry, d);
				});
			
			if (callback)
				callback();
		});
	}

	// In case you ever wanted to filter further by population, this function is here
	// The data is is pre-filtered so as to included the most-populated city per sub-region (admin level 2 region)
	// And exception was made for Nice: Grasse is more populous than Nice, but Nice is clearly the more well-known city
	// Some cities within large metropoli (especially Paris) were removed: they'd all overlap too much, and they're part of 1 larger urban area anyways.
	function filterPopulation(population)
	{
		return (population > 0);
	}

	this.writeCities = function(mapCountry)
	{
		var mapLoc = "maps/occitania.population.direct.topo.json";
		d3.json(mapLoc, function(error, occitania)
		{
			var myTextLabelGroups = svg.selectAll(".place-label")
				.data(topojson.feature(occitania, occitania.objects.population).features)
				.enter()
				.append("g");

			// Add little gray dot next to city
			myTextLabelGroups.append("path")
				.filter(function(d) { return filterPopulation(d.properties.population); })
				.attr("d", path)
				.attr("class", "place")
				.on('mouseover', function(d)
				{
					selectedRegionManager.select(d.properties.regionname, d.properties.subregionname, d.properties.admin3name, d.properties.cityname, d.properties.population.toLocaleString());
					selectedRegionManager.writeData();
					$(this.nextSibling.nextSibling).css("fill-opacity", 0.1);
				})
				.on('mouseout', function(d)
				{
					$(this.nextSibling.nextSibling).css("fill-opacity", 0.01);
				});

			myTextLabelGroups.append("text")
				.filter(function(d) { return filterPopulation(d.properties.population); })
				.attr("class", "place-label")
				.attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
				.attr("x", function(d)
				{
					if (d.properties.textPosition == "default")
						return d.geometry.coordinates[0] > -1 ? 6 : -6;
					else
						return (d.properties.textPosition == "left") ? -6 : 6;
				})
				.attr("dy", ".35em")
				.style("text-anchor", function(d)
				{
					if (d.properties.textPosition == "default")
						return d.geometry.coordinates[0] > -1 ? "start" : "end";
					else
						return (d.properties.textPosition == "left") ? "end" : "start";
				})
				.text(function(d) { return d.properties.cityname; });

			myTextLabelGroups.append("rect")
				.filter(function(d) { return filterPopulation(d.properties.population); })
				.attr("class", "place-label-bg")
				.attr("transform", function(d)
				{
					var bbox = this.previousSibling.getBBox();
					var coords = projection(d.geometry.coordinates);
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
					selectedRegionManager.select(d.properties.regionname, d.properties.subregionname, d.properties.admin3name, d.properties.cityname, d.properties.population.toLocaleString());
					selectedRegionManager.writeData();
					$(this).css("fill-opacity", 0.1);
				})
				.on('mouseout', function(d)
				{
					$(this).css("fill-opacity", 0.01);
				});
		});
	}
};
