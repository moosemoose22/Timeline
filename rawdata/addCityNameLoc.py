#!/usr/bin/python3

# Python 3!

import csv
cities_list = []

countryCityListCsv = "ine/outputNewSpainIneWithLatLng.csv"
countryCityListCsv = "insee/outputNewFranceInseeWithLatLng.csv"
with open(countryCityListCsv, 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		cities_list.append(row)

print ("Finished loading cities")
#    print data_file
#    writer = csv.writer(data_file, delimiter=',')
#    print writer
#    writer.writerows(france_cities_list)
#      france_cities_list.append(line.strip().split(','))

#with open('franceCities.csv', 'rb') as f:
#    reader = csv.reader(f)
#    france_cities_list = list(reader)

counter = 0
for i in cities_list:
	counter += 1
	i.extend(["default"])
	#{'lng': 0.107929, 'lat': 49.49437}
print ("Finished appending city location. Now writing to file.")

with open(countryCityListCsv, "w") as f:
	writer = csv.writer(f)
	writer.writerows(cities_list)
