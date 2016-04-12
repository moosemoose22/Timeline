#!/usr/bin/python3

# Python 3!

import csv, time, urllib.request, urllib.parse, json, sys
spain_cities_list = []

with open('outputNewSpainIneWithLatLng1000To10000_latest.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		spain_cities_list.append(row)

counter = 0
for i in spain_cities_list:
	if (i[0] == "Castile and León"):
		i[0] = "Castilla y León"
	elif (i[0] == "Castile-La Mancha"):
		i[0] = "Castilla-La Mancha"
	elif (i[0] == "Valencian Community"):
		i[0] = "Comunidad Valenciana"
	elif (i[0] == "Community of Madrid"):
		i[0] = "Comunidad de Madrid"
	elif (i[0] == "Catalonia"):
		i[0] = "Catalunya"
	elif (i[0] == "País Vasco"):
		i[0] = "Euskadi"
	elif (i[0] == "Basque Country"):
		i[0] = "Euskadi"
	elif (i[0] == "Balearic Islands"):
		i[0] = "Illes Balears"
	elif (i[0] == "Canary Islands"):
		i[0] = "Islas Canarias"
	elif (i[0] == "Canarias"):
		i[0] = "Islas Canarias"
	elif (i[0] == "Andalusia"):
		i[0] = "Andalucía"
	elif (i[0] == "Navarre"):
		i[0] = "Comunidad Foral de Navarra"
	elif (i[0] == "Navarra"):
		i[0] = "Comunidad Foral de Navarra"
	elif (i[0] == "Asturias"):
		i[0] = "Principado de Asturias"
	elif (i[2] == "Teruel Community"):
		i[2] = "Comunidad de Teruel"
	elif (i[2] == "Saja and Nansa valleys"):
		i[2] = "Comarca de Saja-Nansa"
	elif (i[2] == "Pas - Miera"):
		i[2] = "Valles Pasiegos"
	elif (i[2] == "Campo de Hellín"):
		i[2] = "Campos de Hellín"
	elif (i[2] == "Besaya Valley"):
		i[2] = "Besaya"
	elif (i[2] == "Western coast of Cantabria"):
		i[2] = "Costa Occidental"
	elif (i[2] == "Eastern coast of Cantabria"):
		i[2] = "Costa Oriental"


with open("outputNewSpainIneWithLatLng1000To10000_latest.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(spain_cities_list)
