# docker-compose

The following commands need to be run from root dir (not inside this folder!)

## build

docker compose -f docker/docker-compose.yml build

## up

docker compose -f docker/docker-compose.yml up -d

**Listenning port** is `80`

# down

docker compose -f docker/docker-compose.yml down -t1
