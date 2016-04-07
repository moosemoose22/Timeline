#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
france_cities_list = []

with open('outputFranceInsee.csv', 'r') as data_file:
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

#print france_cities_list
counter = 0
baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
endURL = ",%20france&key=AIzaSyBJQ24b0wcXyskkuYWcX9dpt-1rP4lY2AQ"
for i in france_cities_list:
	counter += 1
	if ((counter % 8) == 0):
		time.sleep(1.5)
	myUrl = baseURL + urllib.parse.quote(i[5]) + endURL
	print (myUrl)

	response = urllib.request.urlopen(myUrl)
	#data = json.load(response)
	data = json.loads(response.read().decode(response.info().get_param('charset') or 'utf-8'))
	myData = data["results"][0]["geometry"]["location"]
	i.extend([myData['lat'], myData['lng']])
	print (i[0])
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputFranceInseeWithLatLng.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list)

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
