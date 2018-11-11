FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i nodemon -g

COPY . .

EXPOSE 3000

RUN npm run migrate

CMD npm install && nodemon server.js