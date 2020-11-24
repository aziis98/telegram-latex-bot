# Telegram LaTeX Bot

A simple Telegram Bot to render LaTeX made using the https://telegraf.js.org/ NodeJS package.

## Commands

Well, actually just one for now, may be adding commands to set options later

- `/render <expression>` -- Renders the expression (already math mode, display style)

## Usage

This uses `convert` (ImageMagik) and `pdflatex` so they need to be installed on the machine. For precaution there is a timeout of 10s for all requests but generally they take less than a second to render. All temporary _.tex_ files are rendered inside a `.renders` folder (this can be changed in [./renderer.js](./renderer.js)) and are automatically removed after a minute.

### Bot Token

Put your bot token in a `.env` file like

```
BOT_TOKEN=...

```

## TODO

- Add custom rendering settings
- Think more about the actual safty of this bot (this was just made very quickly in ~2h)



