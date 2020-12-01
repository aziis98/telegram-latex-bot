FROM node:15

WORKDIR /home/node/bot

RUN apt update
RUN apt install texlive
RUN apt install imagemagik

COPY . .

RUN npm install

CMD npm start
