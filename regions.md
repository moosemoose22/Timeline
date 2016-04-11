How to get data for all the regions
------
This page assumes that you've installed ogr2ogr and topojson.

To learn more about those applications, check out this tutorial:  
https://bost.ocks.org/mike/map/

This page also assumes that you've gotten the data for the landing page already. [You can learn more about the landing page data here.](landing.md)


ogrinfo FRA_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  FRA_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}

ogrinfo ESP_adm2.shp -geom=NO -sql "SELECT CONCAT(CAST(ID_2 AS character), '\*\*', NAME_1, '\*\*', NAME_2) as newName FROM  ESP_adm2" | grep "newName (String)" | sed 's/  newName (String) = //g' | sed "s/'/\_/g" | sed "s/ /\_/g" | xargs -I {} ./combineIndividuals.sh {}
