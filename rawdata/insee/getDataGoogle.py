#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
france_cities_list = []

with open('HIST_POP_COM_RP13_10000.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		france_cities_list.append(row)

counter = 0
baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
endURL = ",%20france&key=AIzaSyBJQ24b0wcXyskkuYWcX9dpt-1rP4lY2AQ"
for i in france_cities_list:
	counter += 1
	if ((counter % 8) == 0):
		time.sleep(1.5)
	myUrl = baseURL + urllib.parse.quote(i[0]) + endURL
	#print (myUrl)

	response = urllib.request.urlopen(myUrl)
	#data = json.load(response)
	data = json.loads(response.read().decode(response.info().get_param('charset') or 'utf-8'))
	if (data["status"] == "OK"):
		myData = data["results"][0]["geometry"]["location"]
		hasadmin1 = False
		hasadmin2 = False
		for googleAddrItem in data["results"][0]["address_components"]:
			if ((googleAddrItem["types"][0] == "administrative_area_level_1" or googleAddrItem["types"][0] == "colloquial_area") and not hasadmin1):
				hasadmin1 = True
				myRegionCode = googleAddrItem["short_name"]
				myRegionName = googleAddrItem["long_name"]
				i.insert(0, myRegionCode)
				i.insert(1, myRegionName)

			if (googleAddrItem["types"][0] == "administrative_area_level_2"):
				hasadmin2 = True
				mySubRegionCode = googleAddrItem["short_name"]
				mySubRegionName = googleAddrItem["long_name"]
				baseIndex = 0
				if (len(i) > 2):
					baseIndex = 2
				i.insert(baseIndex, mySubRegionCode)
				i.insert(baseIndex + 1, mySubRegionName)

		if (hasadmin1 is False):
			i.insert(0, '')
			i.insert(1, '')
		if (hasadmin2 is False):
			i.insert(2, '')
			i.insert(3, '')

		i.extend([myData['lat'], myData['lng']])
		print (i[4])
	else:
		print (i[0] + " missing")
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputNewFranceInseeWithLatLng10000.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list)
