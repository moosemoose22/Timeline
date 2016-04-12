How to get data for all the regions
------
This page assumes that you've installed ogr2ogr, orginfo (which should come with ogr2ogr), and topojson.

To learn more about those applications, check out this tutorial:  
https://bost.ocks.org/mike/map/

This page also assumes that you've gotten the data for the landing page already. [You can learn more about the landing page data here.](landing.md)

When you click on a region, it zooms open and shows you a closer-up view of the region.  
We literally took the SVG path of the region and zoomed it appropriately.  
We found that the border of the zoomed-in region wasn't as accurate as we wanted.  
One reason for that is that we needed to call --simplify-proportion when we created the boundaries of the large drawing France/Spain.  
We decided to redraw each region once they've been clicked on and the zoom has finished.  
We also want to show additional cities with the zoomed-in view.

Here's how we did this:  
First we need to create per-subregion GEOjson for the area and the cities.  
Run individuals/france/makeFranceIndividuals.py and individuals/spain/makeSpainIndividuals.py  
This creates individual GEOjson files for each subregion for cities.  
The files allfrance.geo.json and allspain.geo.json were created from inseee (France) and ine (Spain) data.  
We then got lat/long data from google for the extra cities.  
We had all the data converted from a csv on http://www.convertcsv.com.  
Note that for Spain, we needed to convert some of the region names from English/non local-language names to the local-language name for the region.
We did that in rawdata/ine/fixRegionNames.py

Here's how we created individual GEOjson files per region:  
We read in each region from the admin2 gadm data, then read in the area of every admin2 region and admin3 region from the admin3 gadm data:  
From individuals/france  
ogrinfo FRA_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\_', NAME_2) as newName FROM  FRA_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./makeTopojson.sh {}  
From individuals/spain  
ogrinfo ESP_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\_', NAME_2) as newName FROM  ESP_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./makeTopojson.sh {}  

We use ogrinfo to read in data. We grab the name of the admin1 and admin2 regions. We then parse out empty lines and any other lines that doesn't have this data. 
Then we replace unneeded data such as field labels. Single quotes and spaces become underscored. We then pass this data to a bash script that creates the area GEOjson. You can ignore the topojson that the files creates.  

Now let's create the population GEOjson and create combined topojson.

Run the following:  
From individuals/france  
ogrinfo FRA_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  FRA_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}  
From individuals/spain  
ogrinfo ESP_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  ESP_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}  

Note that in the bash script for Spain, we need to convert some of the names.

Finally, please note that the admin3 data for Spain is mostly missing. The admin3 region names are often "n.a. (*counter*).  
Here's what we did to fix this (see updateESPmissingAdm3/findAdm3.js):  
The script went through all the cities we have and found out whether they're in a region.  
Cities already have admin3 data from google map APIs.  
If a city is in a region, copy the admin3 data from the city to the region.  
Then rewrite the region data.  
That solved over 1/2 of the missing regions. But we wanted to get remove the vast majority of missing regions.  
We got data for all cities with over 1000 people from http://www.ine.es/nomen2/changeLanguage.do?target=index&language=1.  
We then removed all the cities we already have by running rawdata/ine/reduceOver1000.py.  
We then got the latitude and longitude for these cities by running rawdata/ine/getDataGoogle1000To10000.py. Note that the google map APIs have a limit of 2500 queries you can make in a day for free. The script assumes that if you don't get a response of OK, you hit that limit. You'll need to continue the next day. The script has logic to pick up where you left off.  
We went to http://www.convertcsv.com to make GEOjson out of the data we had (rawdata/ine/outputNewSpainIneWithLatLng1000To10000_latest.csv).  
We created GEOjson for each region by running updateESPmissingAdm3/makeSpainIndividualsOver1000.py
We then ran the same script we did before to copy admin3 data from these cities to the region data (updateESPmissingAdm3/findAdm3.js).  

For Andorra: we did it by hand since it's so small.  
We created the GEOjson for the area by runnig this:  
ogr2ogr   -f GeoJSON   AND_adm1.json  AND_adm1.shp  
We then googled for the population data of the biggest cities in Andorra.  We created rawdata/andorra.csv, and got the lat/long information for it either from http://www.latlong.net or from google map APIs.  
We converted that information from a csv to GEOjson on http://www.convertcsv.com.  
Then we combined it with the GEOjson for the area by running individuals/andorra/combineIndividuals.sh

Monaco is so small that we did only a basic version of the large data: we ran ogr2ogr on the MCO_adm0.sh file from gadm and uploaded it.

Then upload each country's individual topojson files to maps/regions/\*country\*

Then you have the data for each region!!
