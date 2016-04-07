#!/bin/bash

topojson  \
  -o andorra.1.topo.json \
  --properties Cntry=ISO,regionname=NAME_0,subregionname=NAME_1,region=HASC_1,populregionname=RegionName,cityname=CityName,population=Population \
  region=AND_adm1.json \
  -- \
  population=andorra.geo.json
