# Hacker News

## Install
---
You need to have MongoDB pre-installed and, if needed, change the conf in `conf/config.js`

If you don't have PM2 installed, please run `npm install -g pm2`

By defaut, the server runs on port 8081 but you can change it in `conf/config.js`

## Run server
---
Start server with PM2 choosing the "right" ecosystem (in dev, server restart for each file modification) :
```npm start```
See logs with `pm2 logs server`

Start server without PM2 :
```node server```

## Run tests
---
With code coverage
```/node_modules/.bin/istanbul cover node_modules/.bin/_mocha tests/**/*.js src```

Without code coverage
```/node_modules/.bin/_mocha tests/**/*.js```
