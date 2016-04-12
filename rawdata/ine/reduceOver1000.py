#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
spain_cities_list_over_1000 = []
spain_cities_list_over_1000_edited = []

with open('outputSpainIneOver1000.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		spain_cities_list_over_1000.append(row)


spain_cities_list_smaller = list()
counter = 0
for i in spain_cities_list_over_1000:
	if (int(i[2]) < 10000):
		spain_cities_list_over_1000_edited.append(i)

with open("outputSpainIne1000To10000.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(spain_cities_list_over_1000_edited)

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
