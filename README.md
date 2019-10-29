# Chrome headless docker

![Imgur](https://i.imgur.com/Mxzowil.png)

[![Build Status](https://travis-ci.org/techulus/chrome-headless-docker.svg?branch=master)](https://travis-ci.org/techulus/chrome-headless-docker)

## Build

Using can build the application using:
```
docker build -t chrome-headless-docker .
```

## Start Server

Start the server on port `8081` using docker
```
docker run --shm-size=2gb -p 8081:8081 chrome-headless-docker:latest
```

## Connecting using Puppeteer

```
await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:8081' })
```
