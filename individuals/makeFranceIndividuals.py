#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys, subprocess
import unicodedata

def strip_accents(s):
	return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')

france_cities_list = []

with open('../rawdata/insee/outputFranceFinal.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		france_cities_list.append(row)

myDict = {}

counter = 0
for i in france_cities_list:
	#print (strip_accents(i[1]) + "_" + strip_accents(i[3]))
	filename = strip_accents(i[1]) + "_" + strip_accents(i[3])
	filename = filename.replace(" ", "_")
	filename = filename.replace("'", "_")
	filename = filename.lower()
	#print (i[1].replace("'", "\\'"))
	subprocess.call(['ogr2ogr', '-f', 'GeoJSON', '-where', "RegionName='" + i[1].replace("'", "\\'") + "' and DeptName='" + i[3].replace("'", "\\'") + "'", 'france/regionsGeoPopulation/' + filename + '.json', 'allfrance.geo.json'])
	#sys.exit()
	counter += 1
