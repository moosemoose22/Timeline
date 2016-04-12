#!/usr/bin/python3

# Python 3!

# Go through file and choose the city with the largest population per admin2 admin region

import csv, time, urllib.request, urllib.parse, json, sys
france_cities_list = []

with open('outputNewFranceInseeWithLatLng.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		france_cities_list.append(row)

myDict = {}

counter = 0
for i in france_cities_list:
	admin2name = i[1]
	# If city doesn't exist, you get back "Never"
	rowIndex = myDict.get(admin2name, "Never")
	i.extend(['default'])
	if (rowIndex == "Never"):
		myDict[admin2name] = counter
	else:
		rowObj = france_cities_list[rowIndex]
		if (int(i[3]) > int(rowObj[3])):
			myDict[admin2name] = counter
	counter += 1

france_cities_list_smaller = list()
counter = 0
for i in france_cities_list:
	admin2name = i[1]
	if (myDict[admin2name] == counter):
		france_cities_list_smaller.append(i)
	counter += 1
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputFranceFinal.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list_smaller)
