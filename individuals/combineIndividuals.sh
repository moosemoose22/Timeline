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
  region=regionsGeoNewName/france.${filename}.json \
  -- \
  population=regionsGeoPopulation/${filename}.json \
