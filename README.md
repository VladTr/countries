## Install

1. Clone the project
2. Run `npm i` in the project folder

## Usage
1. Run `node server`


```bash
# Run in Docker
docker-compose up
# use -d flag to run in background

# Tear down
docker-compose down

# To be able to edit files, add volume to compose file
volumes: ['./:/usr/src/app']

# To re-build
docker-compose build
```
