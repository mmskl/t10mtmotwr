#!/usr/bin/env bash

APP_PORT=5033

docker run -d \
    -v "$PWD":/usr/src/app \
    -w /usr/src/app \
    -p 127.0.0.1:5033:5033 \
    -e APP_HOST='0.0.0.0' \
    -e APP_PORT=$APP_PORT \
    -v ${PWD}/cache:/usr/src/app/cache \
    node:alpine \
    sh -c 'npm install && npm run start'
