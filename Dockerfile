FROM node:latest

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm i

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
