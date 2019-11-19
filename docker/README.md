# Passwordcockpit image
This Dockerfile is used to build only dev images

## Build
docker build -t passwordcockpit/frontend:dev-1.0.0 .

## Push
docker login docker.io
docker push passwordcockpit/frontend:dev-1.0 

## Docker-compose
```
version: "3.5"
services:
  passwordcockpit_frontend:
    image: passwordcockpit/frontend:dev-1.0
    container_name: passwordcockpit_frontend
    volumes:
      - ./:/usr/src/app
    ports:
      - "4200:4200"
      - "35730:35730"
    environment:
      PASSWORDCOCKPIT_BACKEND_BASEHOST: http://localhost:8080
```