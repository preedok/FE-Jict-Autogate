#!/bin/bash

IMAGE_NAME="ther12k/joingateocrmonitoring"
CONTAINER_NAME="joingateocrmonitoring"

# Check if the Docker image exists
if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]] || [[ "$1" == "forcebuild" ]]; then
  echo "Building Docker image..."
  docker build --build-arg DEPLOY_ENV=production -t $IMAGE_NAME .
fi

# Stop and remove the existing container
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME

# Run the container
docker run -d -p 1000:80 --name $CONTAINER_NAME $IMAGE_NAME
