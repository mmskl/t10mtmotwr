#!/usr/bin/env bash

BIND_PORT=5033

docker run -d \
    -v "$PWD":/usr/src/app \
    -w /usr/src/app \
    -p 127.0.0.1:${BIND_PORT}:5033 \
    node:alpine \
    sh -c 'npm install && npm run start'
