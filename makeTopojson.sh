echo $1
ogr2ogr  \
 -f GeoJSON  \
  -where "ID_2 = $1" \
 regionsGeo/france.$1.json \
 FRA_adm5.shp
 
topojson --simplify-proportion .5 \
  -o regionsTopo/france.$1.topo.json \
  --properties Cntry=ISO,regionname=NAME_1,subregionname=NAME_2,region=HASC_2,admin3name=NAME_3,admin4name=NAME_4,admin5name=NAME_5,type=ENGTYPE_5 \
  regionsGeo/france.$1.json





{ "type": "Feature", "properties": { "ID_0": 79, "ISO": "FRA", "NAME_0": "France", "ID_1": 1, "NAME_1": "Alsace", "ID_2": 1, "NAME_2": "Bas-Rhin",
	"ID_3": 1, "NAME_3": "Haguenau", "ID_4": 1, "NAME_4": "Bischwiller", "ID_5": 1, "NAME_5": "Auenheim", "CCN_5": 0, "CCA_5": null, "TYPE_5": "Commune simple", "ENGTYPE_5": "Commune" }
