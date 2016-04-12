#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
spain_cities_list = []

with open('outputSpain.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		spain_cities_list.append(row)

myDict = {}

#01 Araba/Álava,002 Amurrio,10263
#DeptName,CityName,Population
spain_cities_list_smaller = list()
counter = 0
for i in spain_cities_list:
	counter += 1
	deptArr = i[0].split(' ', 1)
	deptName = deptArr[1]
	if (deptName.find("/") != -1):
		deptNameArr = deptName.split('/', 1)
		deptName = deptNameArr[0]
	cityArr = i[1].split(' ', 1)
	cityName = cityArr[1]
	if (cityName.find("/") != -1):
		cityNameArr = cityName.split('/', 1)
		cityName = cityNameArr[0]
	g = [deptName, cityName, int(i[2])]
	spain_cities_list_smaller.append(g)
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputSpainParsed.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(spain_cities_list_smaller)
