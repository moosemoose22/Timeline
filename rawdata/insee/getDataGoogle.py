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
		hasadmin3 = False
		for googleAddrItem in data["results"][0]["address_components"]:
			if ((googleAddrItem["types"][0] == "administrative_area_level_1" or googleAddrItem["types"][0] == "colloquial_area") and not hasadmin1):
				hasadmin1 = True
				myRegionName = googleAddrItem["long_name"]

			if (googleAddrItem["types"][0] == "administrative_area_level_2"):
				hasadmin2 = True
				mySubRegionName = googleAddrItem["long_name"]

			if (googleAddrItem["types"][0] == "administrative_area_level_3"):
				hasadmin3 = True
				mySubRegionName = googleAddrItem["long_name"]

		if (hasadmin1 is False):
			i.insert(0, '')
		else:
			i.insert(0, myRegionName)
		if (hasadmin2 is False):
			i.insert(1, '')
		else:
			i.insert(1, mySubRegionName)
		if (hasadmin3 is False):
			i.insert(2, '')
		else:
			i.insert(2, mySubRegionName)

		i.extend([myData['lat'], myData['lng']])
		print (i[3])
	else:
		print (i[0] + " missing")
	#{'lng': 0.107929, 'lat': 49.49437}

with open("outputNewFranceInseeWithLatLng10000.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(france_cities_list)
