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
