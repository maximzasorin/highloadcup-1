#/bin/bash

sleep 10

unzip -o /tmp/data/data.zip -d /data/initial &> /dev/null

for filename in /data/initial/users_*.json; do
	cat $filename | jq '.users' | mongoimport --db travels --collection users --jsonArray &> /dev/null
	echo "import $filename"
done

for filename in /data/initial/locations_*.json; do
	cat $filename | jq '.locations' | mongoimport --db travels --collection locations --jsonArray &> /dev/null
	echo "import $filename"
done

for filename in /data/initial/visits_*.json; do
	cat $filename | jq '.visits' | mongoimport --db travels --collection visits --jsonArray &> /dev/null
	echo "import $filename"
done

npm run prod