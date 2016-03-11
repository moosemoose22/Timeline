var regionFuncs = new function()
{
	var mapStr = "maps/alsace.topo.json";
	this.init = function()
	{
		d3.json(mapStr, function(error, alsace)
		{
			console.log(alsace);
		};
	}
};
