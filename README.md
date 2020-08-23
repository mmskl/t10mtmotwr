# Top 10 Most Torrented Movies Of The Week Rss

Torrentfreak.com's weekly rank used to have separate rss channel, it doesn't work anymore.
This package recreates it.

## Install

### on host

```
npm install
npm start
```

and visit 127.0.0.1:5033


### using docker

(here binding to localhost's 5033 port)

```
docker run -d \
    -v "$PWD":/usr/src/app \
    -w /usr/src/app \
    -p 127.0.0.1:5033:5033 \
    -v ${PWD}/cache:/usr/src/app/cache \
    node:alpine \
    sh -c 'npm install && npm run start'
```

### Configure

You can set following env vars:

  * APP_HOST 
  * APP_PORT
  * CACHE_VALIDITY - how long cache is valid (in seconds)


## [https://t10mtmotwr.gargantua.xyz](Demo)
