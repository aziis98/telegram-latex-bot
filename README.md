# Telegram LaTeX Bot

A simple Telegram Bot to render LaTeX made using the [Telegraf](https://telegraf.js.org/) package.

## Commands

Well, actually just one for now (maybe adding commands to set options in the future)

- **/render** _expression_ 

    Renders the expression already in math mode display style, so no extra dollars are needed.

## Usage

This uses _convert_ (ImageMagik) and _pdflatex_ so they need to be installed on the machine. To install npm dependecies run `npm install` or `npm i`.

For precaution there is a timeout of 10s for all requests but generally they take less than a second to render. All temporary _.tex_ files are rendered inside the _.renders_ folder (this can be changed in [./renderer.js](./renderer.js)) and are automatically removed after a minute.

### Bot Token

Put your bot token in a `.env` file like

```
BOT_TOKEN=...
```

## TODO

- Add custom rendering settings
- Think more about the actual safety of this bot (this was made very quickly in just ~2h)
    
    An idea could be to host this bot personally and ad a way of marking trusted users by the bot

    Now there is a Dockerfile for containerizatoin ([./Dockerfile](./Dockerfile))



