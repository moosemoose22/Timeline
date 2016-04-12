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
ogrinfo FRA_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '_', NAME_2) as newName FROM  FRA_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./makeTopojson.sh {}
From individuals/spain
ogrinfo ESP_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '_', NAME_2) as newName FROM  ESP_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./makeTopojson.sh {}

We use ogrinfo to read in data. We grab the name of the admin1 and admin2 regions. We then parse out empty lines and any other lines that doesn't have this data. 
Then we replace unneeded data such as field labels. Single quotes and spaces become underscored. We then pass this data to a bash script that creates the area GEOjson. You can ignore the topojson that the files creates.  

Now let's create the population GEOjson and create combined topojson.

Run the following:  
From individuals/france
ogrinfo FRA_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  FRA_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}
From individuals/spain
ogrinfo ESP_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  ESP_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}

Note that in the bash script for Spain, we need to convert some of the names.
