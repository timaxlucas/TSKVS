#!/bin/bash

screen -X -S tskvs_backdoor stuff "^C"
screen -dmS tskvs_backdoor node /root/sheet5/03/tskvs/index.js