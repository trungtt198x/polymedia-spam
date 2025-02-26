# Build

docker build -t web -f docker/web/Dockerfile .

# Run

docker run --name spam-web -it --rm -p 80:80 web
