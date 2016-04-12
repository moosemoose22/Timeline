#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
france_cities_list = []

with open('outputFrance.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		france_cities_list.append(row)

#    print data_file
#    writer = csv.writer(data_file, delimiter=',')
#    print writer
#    writer.writerows(france_cities_list)
#      france_cities_list.append(line.strip().split(','))

#with open('franceCities.csv', 'rb') as f:
#    reader = csv.reader(f)
#    france_cities_list = list(reader)

france_cities_list_smaller = list()
counter = 0
for i in france_cities_list:
	counter += 1
	newPopulation = i[7].replace(",", "")
	g = [i[1], i[3], i[5], int(newPopulation)]
	france_cities_list_smaller.append(g)
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputFranceSmaller.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list_smaller)
