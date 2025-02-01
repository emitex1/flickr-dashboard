# Variables
DOCKER_IMAGE=flickr-dashboard
DOCKER_CONTAINER=flickr-dashboard-container
FRONTEND_DIR=packages/frontend
FUNCTIONS_DIR=packages/functions

# Default target
default: help

# Help section
help:
	@echo "Available commands:"
	@echo "  make build       Build the Docker image"
	@echo "  make run         Run the application in Docker"
	@echo "  make clean       Clean up Docker containers and images"
	@echo "---------------------------------------------------------------"
	@echo "  make build2      Build each Docker image separately, then run a container for each image"
	@echo "  make run2        Run each application separately"
	@echo "  make stop2       Stop all of the docker containers"

run2:
	docker compose up

build2:
	docker compose up --build

stop2:
	docker compose down

# Build the Docker image
build:
	docker build -t $(DOCKER_IMAGE) .

# Run the Docker container
run:
	docker rm -f $(DOCKER_CONTAINER) || true
	docker run -p 5001:5001 -p 5173:5173 --name $(DOCKER_CONTAINER) $(DOCKER_IMAGE)

# Clean up Docker
clean:
	docker rm -f $(DOCKER_CONTAINER) || true
	docker rmi $(DOCKER_IMAGE) || true
