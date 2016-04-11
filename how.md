How did this map come to be?
------

First of all, I followed the awesome tutorial here:
https://bost.ocks.org/mike/map/

This shows you how to make a map such as the one in this git repository.

In order to build a map of Spain/France, there were a few questions we wanted to ask:  
Where can we get the data that shows regions and boundaries?  
Where can we get city data?

You'd think that the source for both of the above would be the same.

Mike Bobstock in the example above got his data from http://www.naturalearthdata.com/.
My problem was that I wanted to show more cities than the ones available in naturalearthdata.

#### First we need to get geographic data.
This led me to http://gadm.org.  
I downloaded ESRI shapefiles of Spain and France.  
Unfortunately for Spain, some of the shapefiles were missing!  
So I downloaded a Geopackage (SpatiaLite) file and converted it to shapefiles in the directory shp:  
ogr2ogr -f "ESRI Shapefile" shp ESP_adm.gpkg -dsco SPATIALITE=yes  
This provided the missing shapefiles!  
Monaco didn't have any shapefiles, so we ran this:  
ogr2ogr -f "ESRI Shapefile" shp MCO_adm.gpkg -dsco SPATIALITE=yes

#### Next we wanted to create topojson files that would draw France, Spain, and all the regions within.
In order to get topojson, we need to convert the shapefiles we have to geojson.

Here's the code to convert the ESRI shapefiles to GEOJSON:  
France:  
ogr2ogr  \  
 -f GeoJSON  \  
 FRA_adm2.json \  
 FRA_adm2.shp

Spain:  
ogr2ogr  \  
 -f GeoJSON  \  
 ESP_adm2.json \  
 ESP_adm2.shp

Andorra:  
ogr2ogr  \  
 -f GeoJSON  \  
 AND_adm0.json \  
 AND_adm0.shp
 
Monaco:  
ogr2ogr -f GeoJSON  MCO_adm0.json MCO_adm0.shp

#### Now let's convert these GEOjson files to topojson.

Andorra:  
topojson -o andorra.adm0.topo.json  \  
  --properties Cntry=ISO,regionname=NAME_ENGLI,subregionname=NAME_ENGLI,subregionID=1,region=ISO \  
  admin0=AND_adm0.json

Monaco:  
topojson -o monaco.adm0.topo.json  \  
  --properties Cntry=ISO,regionname=NAME_ENGLI,subregionname=NAME_ENGLI,subregionID=0,region=ISO \  
  admin0=MCO_adm0.json

France:  
topojson --simplify-proportion .25 -o france.adm2.topo.json  \  
  --properties Cntry=ISO,regionname=NAME_1,regionID=ID_1,subregionname=NAME_2,subregionID=ID_2,region=HASC_2 \  
  admin2=FRA_adm2.json

Spain:  
topojson --simplify-proportion .3 -o spain.adm2.topo.json  \  
  --properties Cntry=ISO,regionname=NAME_1,regionID=ID_1,subregionname=NAME_2,subregionID=ID_2,region=HASC_2 \  
  admin2=ESP_adm2.json

If you look at Spain and France, you'll see that we added --simplify-proportion.
This makes the topojson files smaller and more manageable for most browsers.
Please note that as of today, Chrome deals with larger topojson files much better.
With Firefox, the page starts slowing down.
One day, we might have 2 versions: 1 for Chrome, and 1 for everybody else.


#### Now we need to get the city data.

##### Instructions for France:
1) Go to http://www.insee.fr/fr/ppp/bases-de-donnees/recensement/populations-legales/france-departements.asp?annee=2013

2) Download the XLS titled "France métropolitaine et DOM."
Go to the tab titles "Arondissements."
Copy all the data there and put it in a new XLS sheet or document.
Export this as a CSV.
I saved it as rawdata/france/outputFrance.csv.

3) Parse the population data
The population has commas, and that could cause problems later on.
The output also has unneeded columns.
You can do both these tasks by running the script rawdata/france/getFranceData.py

4) Remove cities around Paris
Paris has tons of people, and there are many geographically small regions around it.
For the admin1 region called Île-de-France, the only city we'll show is Paris.
Delete all entries for Île-de-France that aren't Paris.

5) Add latitude and longitude coordinates to the CSV
We do this by using google's geocoding service!
https://developers.google.com/maps/documentation/geocoding/intro
You need to sign up for the service and key a key.
Once you have that, you can run rawdata/france/getData.py
and put your key into the code

6) Show only the largest city per region
You can do this by running rawdata/france/parseFranceData.py.


##### Instructions for Spain:
1) Go to http://www.ine.es/nomen2/changeLanguage.do?target=index&language=1
My instructions are for the English version of the site.
I chose a Geographic criterion of "National Level."
Entity type criterion of "Only municipalities."
Population size criterion of "Total population" "Greater than" "20000".
"Select years" of "2015"

2) That gave me around 4 pages of data.
I copied and pasted the data into a spreadsheet which I exported as outputSpain.csv.

3) Parse the place data
The place data has codes in them.
You can run the script rawdata/spain/getSpainIne.py

3) Add latitude and longitude coordinates to the CSV
We do this by using google's geocoding service!
https://developers.google.com/maps/documentation/geocoding/intro
You need to sign up for the service and key a key.
Once you have that, you can run rawdata/spain/getDataGoogle.py
and put your key into the code

4) Show only the largest city per region
You can do this by running rawdata/spain/parseSpainData.py.


##### Instructions for Andorra:
1) Get populaton data
Andorra La Vella is both the capital and largest city in Andorra
I went to the least vetted source possible, but it's probably good enough:
https://population.mongabay.com/population/Andorra/
If that doesn't work, just google "population cities andorra" or go to wikipedia or something like that.

2) Manually get the coordinate and admin level 1 data either from google or from http://www.latlong.net or elsewhere
https://maps.googleapis.com/maps/api/geocode/json?address=El%20Tarter,%20Andorra&key=*APIkey*

3) I created a comma-delimited string with Andorra region, city, population, lat, and long:  
Andorra,Andorra la Vella,Andorra la Vella,20430,42.506317,1.52183


##### Instructions for Monaco:
1) Get populaton data
Go to wikipedia or whatever data source of yoru choice

2) Manually get the coordinate and admin level 1 data either from google or from http://www.latlong.net or elsewhere
https://maps.googleapis.com/maps/api/geocode/json?address=El%20Tarter,%20Andorra&key=*APIkey*

3) I created a comma-delimited string with Andorra region, city, population, lat, and long:  
Monaco,Monaco,Monaco,37831,43.7384,7.4246



#### Convert the data to GEOjson
Go to http://www.convertcsv.com/csv-to-geojson.htm  
Add the following line under "Option 3 - paste into Text Box below":  
RegionName,DeptName,CityName,Population,Lat,Long  
Then paste in the contents of outputFranceFinal.csv, outputSpainFinal.csv, and the strings from Andorra and Monaco above.  
We named the resultant file occitania.direct.geo.json


#### Convert the GEOjson to topojson
Run this:  
topojson -o occitania.population.direct.topo.json \  
  --properties city=CityName,population=Population,admin1=RegionName,admin2=DeptName \  
  population=occitania.direct.geo.json


#### Now you have the city data to show the most populated cities per region!
Upload these files to the maps directory, and each per-country topojson file into maps/*country*
