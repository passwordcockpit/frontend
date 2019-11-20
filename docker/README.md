# Passwordcockpit image
This Dockerfile is used to build only dev images

## Build
docker build -t passwordcockpit/frontend:dev-1.0.0 .

## Push
docker login docker.io
docker push passwordcockpit/frontend:dev-1.0.0