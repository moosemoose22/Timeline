#!/usr/bin/python3

# Python 3!

import csv, sys, re
spain_cities_list = []

with open('outputSpain.csv', 'r') as data_file:
	reader = csv.reader(data_file)
	for row in reader:
		spain_cities_list.append(row)

#    print data_file
#    writer = csv.writer(data_file, delimiter=',')
#    print writer
#    writer.writerows(spain_cities_list)
#      spain_cities_list.append(line.strip().split(','))

#with open('franceCities.csv', 'rb') as f:
#    reader = csv.reader(f)
#    spain_cities_list = list(reader)

#print spain_cities_list
counter = 0
for i in spain_cities_list:
	counter += 1
	i[4] = re.sub(r"Flag of .*\.svg ", '', i[4])
	

with open("outputSpainNoFlag.csv", "w") as f:
	writer = csv.writer(f)
	writer.writerows(spain_cities_list)

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
