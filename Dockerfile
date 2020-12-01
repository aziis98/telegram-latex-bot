FROM node:15

WORKDIR /home/node/bot

RUN apt update -q
RUN apt install -qy texlive imagemagick

COPY . .

RUN npm install

CMD npm start
