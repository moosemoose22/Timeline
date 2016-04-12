#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
france_cities_list = []

with open('outputFranceSmaller.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		france_cities_list.append(row)

counter = 0
baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
APIkey = "AIzaSyBJQ24b0wcXyskkuYWcX9dpt-1rP4lY2AQ"
endURL = ",%20france&key=" + APIkey
for i in france_cities_list:
	counter += 1
	if ((counter % 8) == 0):
		time.sleep(1.5)
	myUrl = baseURL + urllib.parse.quote(i[1]) + ",%20" + urllib.parse.quote(i[0]) + endURL
	print (myUrl)

	response = urllib.request.urlopen(myUrl)
	data = json.loads(response.read().decode(response.info().get_param('charset') or 'utf-8'))
	myData = data["results"][0]["geometry"]["location"]
	i.extend([myData['lat'], myData['lng']])
	print (i[1])

with open("outputFranceSmallerWithLatLong.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list)

