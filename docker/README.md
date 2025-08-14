# docker-compose

The following commands need to be run from root dir (not inside this folder!)

## Configuration

Specified in the file `sdk/src/config.json`

## build

docker compose -f docker/docker-compose.yml build

## up

docker compose -f docker/docker-compose.yml up -d

**Listenning port** is `80`

# down

docker compose -f docker/docker-compose.yml down -t1
