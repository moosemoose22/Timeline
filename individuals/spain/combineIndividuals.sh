#!/bin/bash

IFS="**"

declare -a Array=($*) 
id2=`echo "${Array[0]}"`
# Need to make it lowercase after conversion to ascii b/c upper-case with diacritics won't be lower-cased
regionname=`echo "${Array[2]}" | iconv -f utf8 -t ascii//TRANSLIT  | tr '[:upper:]' '[:lower:]'`
subregionname=`echo "${Array[4]}" | iconv -f utf8 -t ascii//TRANSLIT  | tr '[:upper:]' '[:lower:]'`
#echo ${id2}
arearegionname=$regionname
areasubregionname=$subregionname

if [ "$regionname" = "pais_vasco" ]; then
	arearegionname="euskadi"
fi
if [ "$regionname" = "comunidad_foral_de_navarra" ]; then
	arearegionname="navarra"
fi
if [ "$regionname" = "principado_de_asturias" ]; then
	arearegionname="asturias"
fi
if [ "$regionname" = "ceuta_y_melilla" ]; then
	arearegionname="ceuta"
fi
if [ "$regionname" = "cataluna" ]; then
	arearegionname="catalunya"
fi
if [ "$regionname" = "castile_and_leon" ]; then
	arearegionname="castilla_y_leon"
fi
if [ "$regionname" = "islas_baleares" ]; then
	arearegionname="illes_balears"
fi


if [ "$subregionname" = "alava" ]; then
	areasubregionname="araba"
fi
if [ "$subregionname" = "guipuzcoa" ]; then
	areasubregionname="gipuzkoa"
fi
if [ "$subregionname" = "vizcaya" ]; then
	areasubregionname="bizkaia"
fi
if [ "$subregionname" = "baleares" ]; then
	areasubregionname="illes_balears"
fi


echo ${regionname}
echo ${subregionname}

topojson  \
  -o regionsTopoNewName/spain.${arearegionname}_${areasubregionname}.topo.json \
  --properties Cntry=ISO,arearegionname=NAME_1,areasubregionname=NAME_2,region=HASC_2,admin3name=NAME_3,populregionname=RegionName,populsubregionname=DeptName,cityname=CityName,numsubareas=NumSubAreas,population=Population \
  region=regionsGeoNewName/spain.${regionname}_${subregionname}.json \
  -- \
  population=regionsGeoPopulation/${arearegionname}_${areasubregionname}.json \
