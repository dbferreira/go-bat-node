FROM node:latest

# Create app directory
WORKDIR /usr/src/nodeapp
RUN mkdir -p /usr/src/nodeapp

# Install app dependencies
COPY ./package.json /usr/src/nodeapp/
RUN npm install && npm install -g nodemon
