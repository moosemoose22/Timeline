#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
spain_cities_list = []

with open('allSpainCities.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		spain_cities_list.append(row)

myDict = {}

#01 Araba/Álava,002 Amurrio,10263
#RegionCode,RegionName,DeptCode,DeptName,CityCode,CityName
spain_cities_list_smaller = list()
counter = 0
for i in spain_cities_list:
	counter += 1
	deptArr = i[0].split(' ', 1)
	deptCode = deptArr[0]
	deptName = deptArr[1]
	if (deptName.find("/") != -1):
		deptNameArr = deptName.split('/', 1)
		deptName = deptNameArr[0]
	cityArr = i[1].split(' ', 1)
	cityCode = cityArr[0]
	cityName = cityArr[1]
	if (cityName.find("/") != -1):
		cityNameArr = cityName.split('/', 1)
		cityName = cityNameArr[0]
	g = [deptCode, deptName, cityCode, cityName, '', int(i[2])]
	spain_cities_list_smaller.append(g)
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputSpainIne.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(spain_cities_list_smaller)

'''
arrPos = len(spain_cities_list) - 1
print type(spain_cities_list[arrPos][3])
print spain_cities_list[arrPos][3]
response = urllib2.urlopen('http://nominatim.openstreetmap.org/search?q=' + spain_cities_list[arrPos][3] + ',%20france&format=json')
franceData = response.read()
franceJSON = json.loads(franceData)
print franceJSON[0]['lon']
print franceJSON[0]['lat']
'''
