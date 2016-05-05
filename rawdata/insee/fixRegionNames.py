#!/usr/bin/python3

# Python 3!

import csv, sys
france_cities_list = []

fileToFix = "outputNewFranceInseeWithLatLng1000to10000.csv"
fileToFix = "outputFranceFinal.csv"
with open(fileToFix, 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		france_cities_list.append(row)

counter = 0
for i in france_cities_list:
	if (len(i) > 3):
		if (i[0] == "Brittany"):
			i[0] = "Bretagne"
		elif (i[0] == "Upper Normandy"):
			i[0] = "Haute-Normandie"
		elif (i[0] == "Lower Normandy"):
			i[0] = "Basse-Normandie"
		elif (i[0] == "Normandy"):
			i[0] = "Normandie"
		elif (i[0] == "Corsica"):
			i[0] = "Corse"
		elif (i[0] == "Picardy"):
			i[0] = "Picardie"
		elif (i[0] == "Burgundy"):
			i[0] = "Bourgogne"

with open(fileToFix, "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list)
