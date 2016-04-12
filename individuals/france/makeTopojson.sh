#!/bin/bash

IFS="**"

declare -a Array=($*) 
id2=`echo "${Array[0]}"`
# Need to make it lowercase after conversion to ascii b/c upper-case with diacritics won't be lower-cased
filename=`echo "${Array[2]}" | iconv -f utf8 -t ascii//TRANSLIT  | tr '[:upper:]' '[:lower:]'`
#echo ${id2}
echo ${filename}
ogr2ogr  \
 -f GeoJSON  \
  -where "ID_2 = ${id2}" \
 regionsGeoNewName/france.${filename}.json \
 FRA_adm3.shp
 
topojson  \
  -o regionsTopoNewName/france.${filename}.topo.json \
  --properties Cntry=ISO,regionname=NAME_1,subregionname=NAME_2,region=HASC_2,admin3name=NAME_3 \
  region=regionsGeoNewName/france.${filename}.json


#{ "type": "Feature", "properties": { "ID_0": 79, "ISO": "FRA", "NAME_0": "France", "ID_1": 1, "NAME_1": "Alsace", "ID_2": 1, "NAME_2": "Bas-Rhin",
#	"ID_3": 1, "NAME_3": "Haguenau", "ID_4": 1, "NAME_4": "Bischwiller", "ID_5": 1, "NAME_5": "Auenheim", "CCN_5": 0, "CCA_5": null, "TYPE_5": "Commune simple", "ENGTYPE_5": "Commune" }

#echo $1
#ogr2ogr  \
# -f GeoJSON  \
#  -where "ID_2 = $1" \
# regionsGeo3/france.$1.json \
# FRA_adm3.shp
 
#topojson  \
#  -o regionsTopo3/france.$1.topo.json \
#  --properties Cntry=ISO,regionname=NAME_1,subregionname=NAME_2,region=HASC_2,admin3name=NAME_3 \
#  region=regionsGeo3/france.$1.json


#{ "type": "Feature", "properties": { "ID_0": 79, "ISO": "FRA", "NAME_0": "France", "ID_1": 1, "NAME_1": "Alsace", "ID_2": 1, "NAME_2": "Bas-Rhin",
#	"ID_3": 1, "NAME_3": "Haguenau", "ID_4": 1, "NAME_4": "Bischwiller", "ID_5": 1, "NAME_5": "Auenheim", "CCN_5": 0, "CCA_5": null, "TYPE_5": "Commune simple", "ENGTYPE_5": "Commune" }
