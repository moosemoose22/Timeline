var selectedRegionManager = new function()
{
	// Private variables
	var p_currentRegionAdm1;
	var p_currentRegionAdm2;
	var p_currentRegionAdm3;
	var p_currentCity;
	var p_currentPopulation;
	var p_hasCity;

	// Public functions
	this.select = function(regionAdm1, regionAdm2, regionAdm3, city, population)
	{
		p_currentRegionAdm1 = regionAdm1;
		p_currentRegionAdm2 = regionAdm2;
		if (regionAdm3)
			p_currentRegionAdm3 = regionAdm3;
		else
			p_currentRegionAdm3 = undefined;
		p_hasCity = (city !== undefined);
		if (city)
		{
			p_currentCity = city;
			p_currentPopulation = population;
		}
	}

	this.writeData = function()
	{
		$('#regionName').html(p_currentRegionAdm1);
		$('#subRegionName').html(p_currentRegionAdm2);
		$('#subSubRegionName').html(p_currentRegionAdm3 ? p_currentRegionAdm3 : "");
		if (p_hasCity)
			$('#CityName').html(p_currentCity + "  Population: " + p_currentPopulation);
		else
			$('#CityName').html("");
	}
}
