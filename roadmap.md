Roadmap for the future
------

##### Bugs
1. Some of the level 3 administrative regions in Spain have names such as "n.a.(*counter*)." You can run [updateESPmissingAdm3/findAdm3.js](updateESPmissingAdm3/findAdm3.js) to see them. In the demo, you can see them by opening a region and hovering over a subregion that has such a name.  
2. Most of the level 3 administrative names were obtained by grabbing the level 3 adminstrative data from cities within each subregion (see [updateESPmissingAdm3/updateAdm3.js](updateESPmissingAdm3/updateAdm3.js). This algorithm may have been off at times. Note that the Palencia region has 2 subregions (administrative level 3) that are called Valdivia. One of those is likely incorrect.
3. Prevent city names from being written above other city names.

##### Future plans
1. Possibly have text about each region within the shape of each region.  
2. Show more information about each region
  1. Figure out what information would be interesting and get it.
  2. Design a way to show this information.
3. Add more cities to maps, especially in admin3 regions in France/Spain which have no cities.
4. Add better weighting to cities to determine which cities to show when.
5. Put everything in a database to keep better track of data and allow for easier growth.
