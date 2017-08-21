#/bin/bash

unzip -o /tmp/data/data_train.zip -d /data/initial

for filename in /data/initial/users_*.json; do
	cat $filename | jq '.users' | mongoimport --db travels --collection users --jsonArray
done

for filename in /data/initial/locations_*.json; do
	cat $filename | jq '.locations' | mongoimport --db travels --collection locations --jsonArray
done

for filename in /data/initial/visits_*.json; do
	cat $filename | jq '.visits' | mongoimport --db travels --collection visits --jsonArray
done

npm run dev