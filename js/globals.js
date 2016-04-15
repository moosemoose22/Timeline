// We base IDs on region name
// Here we convert the region names to HTML-friendly strings
function convertID(oldID)
{
	oldID = latinize(oldID);
	oldID = oldID.replace(/ /g, "_");
	oldID = oldID.replace(/'/g, "_");
	return latinize(oldID);
}
