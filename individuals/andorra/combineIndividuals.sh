#!/bin/bash

topojson  \
  -o andorra.andorra_andorra.topo.json \
  --properties Cntry=ISO,regionname=NAME_0,subregionname=NAME_1,region=HASC_1,populregionname=RegionName,cityname=CityName,population=Population,textPosition=TextPosition  \
  region=AND_adm1.json \
  -- \
  population=andorra.geo.json
