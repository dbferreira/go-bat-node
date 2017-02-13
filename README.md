# go-bat-node
Backend listening for changes to a Firebase DB queue.

## Docker support

Just run `docker-compose up -d` to start the server and listen for file-changes.

View the docker logs: `docker-compose logs -f`

Execute commands in the docker container: `docker exec -it <containerID> bash`

Stop container: `docker-compose stop`
