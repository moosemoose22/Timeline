#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
france_cities_list = []

with open('outputFranceInseeWithLatLng.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		france_cities_list.append(row)

myDict = {}

counter = 0
for i in france_cities_list:
	admin2name = i[3]
	rowIndex = myDict.get(admin2name, "Never")
	if (rowIndex == "Never"):
		myDict[admin2name] = counter
	else:
		rowObj = france_cities_list[rowIndex]
		if (int(i[7]) > int(rowObj[7])):
			myDict[admin2name] = counter
	counter += 1

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