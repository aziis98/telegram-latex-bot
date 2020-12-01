FROM node:15

USER node

WORKDIR /home/node/bot

COPY . .

RUN npm install

CMD npm start
