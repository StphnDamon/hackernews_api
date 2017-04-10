Hacker News
====================

===== docker part
docker build -t hackernews/api .
docker run -d -p 49160:8081 -v $(pwd):/app --name hackernews_api hackernews/api
docker exec -it hackernews_api /bin/bash

===== test unit part
./node_modules/.bin/istanbul cover node_modules/.bin/_mocha tests src



* 1h30 pour docker
* 2h pour lire la documentation de GraphQL
