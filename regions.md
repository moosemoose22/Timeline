How to get data for all the regions
------
##### Introduction  
This page assumes that you've installed ogr2ogr, orginfo (which should come with ogr2ogr), and topojson.

To learn more about those applications, check out this tutorial:  
https://bost.ocks.org/mike/map/

This page also assumes that you've gotten the data for the landing page already. [You can learn more about the landing page data here.](landing.md)

The goal of this page is to describe what goes on when we zoom in on a region and how to get the proper data to draw that zoomed-in region.  

When you click on a region, it zooms open and shows you a closer-up view of the region.  
We literally cloned the HTML element the represents that region, attached the clone to a transparent div layer, and then zoom in on that SVG.  
At that point, the region looks great-- though the edges were a bit overly jagged. Also: the border thickness wasn't uniform. Smaller regions-- that got zoomed-in more to fill the screen-- had thicker borders. Larger regions had thinner borders.
Note that when drawing the larger map, we called --simplify-proportion when creating the topojson. There were too many borders, and Firefox used to slow down with too large of an SVG.  

We decided to redraw each region once they've been clicked on and the zoom has finished.  
We also want to show additional cities with the zoomed-in view.


##### Get a bunch of cities for France/Spain  
For France, we went to http://www.insee.fr/fr/ppp/bases-de-donnees/recensement/populations-legales/default.asp and downloaded the link for "Historique des populations par commune depuis 1962".  
We opened it in LibreOfficeCalc (you could use Excel or any spreadsheet program), copied columns F and G, and saved them as [rawdata/insee/HIST_POP_COM_RP13.csv](rawdata/insee/HIST_POP_COM_RP13.csv).  
We sorted it by population in LibreOfficeCalc.  I then grabbed cities with a population of over 10000 and saved it as [rawdata/insee/HIST_POP_COM_RP13.csv](rawdata/insee/HIST_POP_COM_RP13.csv).  
We then got lat/long data from google for the extra cities by running and [rawdata/insee/getDataGoogle.py](rawdata/insee/getDataGoogle.py).  
The result was saved as [rawdata/insee/outputNewFranceInseeWithLatLng.csv](rawdata/insee/outputNewFranceInseeWithLatLng.csv).  

For Spain, it was [rawdata/ine/outputSpainIneOver1000.csv](rawdata/ine/outputSpainIneOver1000.csv).  
We then got lat/long data from google for the extra cities by running and [rawdata/insee/getDataGoogle.py](rawdata/insee/getDataGoogle.py).  
For Spain we got [rawdata/ine/outputSpainIneWithLatLng.csv](rawdata/ine/outputSpainIneWithLatLng.csv) from [ine](http://ine.es/).  
For Spain, the cities had numbers attached to them. You can remove them by running [rawdata/ine/getSpainIne.py](rawdata/ine/getSpainIne.py).  
We then got lat/long data from google for the extra cities by running and [rawdata/ine/getDataGoogle.py](rawdata/ine/getDataGoogle.py).  
The result was saved as [rawdata/ine/outputNewSpainIneWithLatLng.csv](rawdata/ine/outputNewSpainIneWithLatLng.csv).  
[rawdata/ine/outputNewSpainIneWithLatLng.csv](rawdata/ine/outputNewSpainIneWithLatLng.csv) had a bunch of English names in them. I did some manual corrections to them with search/replace.  
You can see what conversions we did by looking at [rawdata/ine/fixRegionNames.py](rawdata/ine/fixRegionNames.py).  
You could modify that file to do the convers for you.


##### Post-processing and converting to topojson for France/Spain  
At this point, we need to add a column for city text direction override. This means that we can manually set whether a city name is on the left of its dot or the right.  
We ran [rawdata/addCityNameLoc.py](rawdata/addCityNameLoc.py) to add "default" to the end of the data.

We had all the data converted from a csv on http://www.convertcsv.com.  
I named the output [individuals/allfrance.geo.json](individuals/allfrance.geo.json) and [individuals/allspain.geo.json](individuals/allspain.geo.json).  

##### Making individual per-region population topojson files  
We need to break this large file up into the individual population geojson files per region.  
We did this by running [individuals/makeFranceIndividuals.py](individuals/makeFranceIndividuals.py) and [individuals/makeSpainIndividuals.py](individuals/makeSpainIndividuals.py).  

##### Making individual per-region area topojson files  
Now we want to create individual per-region files that draw the map of each subregion.  
We read in each region from the admin2 gadm data, then read in the area of every admin2 region and admin3 region from the admin3 gadm data:  
From [individuals/france](individuals/france)  
ogrinfo FRA_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\_', NAME_2) as newName FROM  FRA_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./makeTopojson.sh {}  
From [individuals/spain](individuals/spain)  
ogrinfo ESP_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\_', NAME_2) as newName FROM  ESP_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./makeTopojson.sh {}  

We use ogrinfo to read in data. We grab the name of the admin1 and admin2 regions. We then parse out empty lines and any other lines that doesn't have this data. 
Then we replace unneeded data such as field labels. Single quotes and spaces become underscored. We then pass this data to a bash script that creates the area GEOjson. You can ignore the topojson that the files creates.  

##### Combining area topojson and population topojson  
Run the following:  
From [individuals/france](individuals/france)  
ogrinfo FRA_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  FRA_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}  
From [individuals/spain](individuals/spain)  
ogrinfo ESP_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  ESP_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}  

Note that in the bash script for Spain, we need to convert some of the names.  
You should also get some topojson errors for ceuta_y_melilla and islas_canarias for spain.  
Since those aren't promiment on our map (Tenerife isn't on the map at all currently), I haven't dealt with them yet.

##### Fixing missing admin3 data in Spain  
The admin3 data for Spain from gadm is mostly missing. The admin3 region names are often "n.a. (*counter*).  
You can see  a list of all remaining missing regions by running [updateESPmissingAdm3/findAdm3.js](updateESPmissingAdm3/findAdm3.js).  
Here's what we did to fix this (see [updateESPmissingAdm3/updateAdm3.js](updateESPmissingAdm3/updateAdm3.js)):  
The script went through all the cities we have and found out whether they're in a region.  
Cities already have admin3 data from google map APIs.  
If a city is in a region, copy the admin3 data from the city to the region.  
Then rewrite the region data.  
That solved over 1/2 of the missing regions.  

We wanted to get remove the vast majority of missing regions.  
We got data for all cities with over 1000 people from http://www.ine.es/nomen2/changeLanguage.do?target=index&language=1.  
We then removed all the cities we already have by running [rawdata/ine/reduceOver1000.py](rawdata/ine/reduceOver1000.py).  
We then got the latitude and longitude for these cities by running [rawdata/ine/getDataGoogle1000To10000.py](rawdata/ine/getDataGoogle1000To10000.py). Note that the google map APIs have a limit of 2500 queries you can make in a day for free. The script assumes that if you don't get a response of OK, you hit that limit. You'll need to continue the next day. The script has logic to pick up where you left off.  
We converted some of the region names from English/non local-language names to the local-language name for the region by running [rawdata/ine/fixRegionNames.py](rawdata/ine/fixRegionNames.py).  
We went to http://www.convertcsv.com to make GEOjson out of the data we had [rawdata/ine/outputNewSpainIneWithLatLng1000To10000_latest.csv](rawdata/ine/outputNewSpainIneWithLatLng1000To10000_latest.csv).  
We created GEOjson for each region by running [updateESPmissingAdm3/makeSpainIndividualsOver1000.py](updateESPmissingAdm3/makeSpainIndividualsOver1000.py).  
We then ran the same script we did before to copy admin3 data from these cities to the region data [updateESPmissingAdm3/updateAdm3.js](updateESPmissingAdm3/updateAdm3.js).  

##### Andorra  
We did it by hand since it's so small.  
We created the GEOjson for the area by running this:  
ogr2ogr   -f GeoJSON   AND_adm1.json  AND_adm1.shp  
We then googled for the population data of the biggest cities in Andorra.  We created [rawdata/andorra.csv](rawdata/andorra.csv), and got the lat/long information for it either from http://www.latlong.net or from google map APIs.  
We converted that information from a csv to GEOjson on http://www.convertcsv.com.  
Then we combined it with the GEOjson for the area by running [individuals/andorra/combineIndividuals.sh](individuals/andorra/combineIndividuals.sh).

##### Monaco  
Monaco is so small that we did only a basic version of the large data: we ran ogr2ogr on the MCO_adm0.sh file from gadm and uploaded it.

##### Copying files to live working website  
Then upload each country's individual topojson files to maps/\*country\*/regions.  
For example, [maps/france/regions/france.alsace_bas-rhin.topo.json](france.alsace_bas-rhin.topo.json) went in maps/france/regions/france.alsace_bas-rhin.topo.json.

Then you have the data for each region on your live site!!
