#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys, subprocess
import unicodedata

def strip_accents(s):
	return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')

france_cities_list = []

with open('../outputFranceSmaller.csv', 'r') as data_file:
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

sys.exit()

france_cities_list_smaller = list()
counter = 0
for i in france_cities_list:
	admin2name = i[3]
	if (myDict[admin2name] == counter):
		france_cities_list_smaller.append(i)
	counter += 1
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputFranceSmaller.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list_smaller)

'''
arrPos = len(france_cities_list) - 1
print type(france_cities_list[arrPos][3])
print france_cities_list[arrPos][3]
response = urllib2.urlopen('http://nominatim.openstreetmap.org/search?q=' + france_cities_list[arrPos][3] + ',%20france&format=json')
franceData = response.read()
franceJSON = json.loads(franceData)
print franceJSON[0]['lon']
print franceJSON[0]['lat']
'''
