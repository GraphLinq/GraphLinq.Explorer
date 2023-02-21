#!/bin/sh
PARAMS="{\"chainURL\": $(echo $ERIGON_URL | jq -aR .), \"beaconAPI\": $(echo $BEACON_API_URL | jq -aR .), \"assetsURLPrefix\": \"\"}"
echo $PARAMS > /usr/share/nginx/html/config.json
nginx -g "daemon off;"
