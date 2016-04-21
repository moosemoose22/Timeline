#!/bin/bash

IFS="**"

if [ ! -d "regionsGeoNewName" ]; then
  mkdir regionsGeoNewName
fi
if [ ! -d "regionsTopoNewName" ]; then
  mkdir regionsTopoNewName
fi

declare -a Array=($*) 
id2=`echo "${Array[0]}"`
# Need to make it lowercase after conversion to ascii b/c upper-case with diacritics won't be lower-cased
regionname=`echo "${Array[2]}" | iconv -f utf8 -t ascii//TRANSLIT  | tr '[:upper:]' '[:lower:]'`
subregionname=`echo "${Array[4]}" | iconv -f utf8 -t ascii//TRANSLIT  | tr '[:upper:]' '[:lower:]'`
#echo ${id2}
arearegionname=$regionname
areasubregionname=$subregionname
 

echo ${regionname}
echo ${subregionname}

topojson  \
  -o regionsTopoNewName/france.${arearegionname}_${areasubregionname}.topo.json \
  --properties Cntry=ISO,arearegionname=NAME_1,areasubregionname=NAME_2,region=HASC_2,admin3name=NAME_3,populregionname=RegionName,populsubregionname=DeptName,cityname=CityName,population=Population,textPosition=TextPosition \
  region=regionsGeoNewName/france.${regionname}_${subregionname}.json \
  -- \
  population=regionsGeoPopulation/${arearegionname}_${areasubregionname}.json \
