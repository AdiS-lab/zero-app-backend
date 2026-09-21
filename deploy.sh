#!/bin/bash

echo "--=======Starting=======--";

echo "--=======stopping dockers=======--";
docker-compose down -v
echo "--=======done=======--";

echo "--=======removing images and containers=======--";
yes | sudo docker image prune
yes | sudo docker container prune
yes | sudo docker rmi -f $(sudo docker images -aq)
echo "--=======done =======--";

echo "--=======pulling=======--";
git pull origin main
echo "--=======done=======--";

echo "--=======starting docker images=======--";
docker-compose up -d --build
echo "--=======Done=======--"