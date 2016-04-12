#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
spain_cities_list = []

with open('outputSpainParsed.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		spain_cities_list.append(row)

counter = 0
baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
APIkey = "AIzaSyBJQ24b0wcXyskkuYWcX9dpt-1rP4lY2AQ"
endURL = ",%20spain&key=" + APIkey
for i in spain_cities_list:
	counter += 1
	if ((counter % 8) == 0):
		time.sleep(1.5)
	myUrl = baseURL + urllib.parse.quote(i[1]) + ",%20" + urllib.parse.quote(i[0]) + endURL
	print (myUrl)

	response = urllib.request.urlopen(myUrl)
	data = json.loads(response.read().decode(response.info().get_param('charset') or 'utf-8'))

	if (data["status"] == "OK"):
		myData = data["results"][0]["geometry"]["location"]
		myRegionName = myAdmin3Name = ''
		for googleAddrItem in data["results"][0]["address_components"]:
			# Apparently for Spain, "colloquial_area" is often used for the admin level 1 name
			if ((googleAddrItem["types"][0] == "administrative_area_level_1" or googleAddrItem["types"][0] == "colloquial_area")):
				myRegionName = googleAddrItem["long_name"]

			if (googleAddrItem["types"][0] == "administrative_area_level_3"):
				myAdmin3Name = googleAddrItem["long_name"]

		# insert large region in front
		i.insert(0, myRegionName)
		# insert admin level 3 area after admin level 2
		i.insert(2, myAdmin3Name)
		# insert lat and long at the end
		i.extend([myData['lat'], myData['lng']])
		print (i[3]) # city
	else:
		print (i[0] + " " + i[1] + " missing")
		# Often, the reason you didn't get an OK is because yuo exceeded the unmber of times
		# you can use the google maps API in a day.
		# If you enable stopParsing, it'll stop sending requests to google whever you hit this limit
		stopParsing = False
		if (stopParsing):
			with open("outputNewSpainIneWithLatLng.csv", "w") as f:
				writer = csv.writer(f)
				writer.writerows(spain_cities_list)
			sys.exit()
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputSpainWithLatLng.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(spain_cities_list)
