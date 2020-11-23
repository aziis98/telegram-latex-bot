
const { config: loadDovEnvFile } = require('dotenv')
const { renderLaTeX } = require('./renderer.js');
const { Telegraf } = require('telegraf');

const TelegrafLogger = require('telegraf-logger');

loadDovEnvFile();

const bot = new Telegraf(process.env.BOT_TOKEN);
const logger = new TelegrafLogger({
    format: '[TelegrafLogger] %ut => @%u %fn %ln (%fi): <%ust> %c'
});

bot.use(logger.middleware());

bot.command(['render', 'render@latexit_bot'], async ({ message, from, chat, replyWithMarkdown, replyWithPhoto }) => {
    console.log(`[Bot] @${from.username} ${chat.title ? `in "${chat.title}" ` : ''}sent: ${message.text}`);

    const expression = message.text.replace(/^\/render.*?( |$)/, '');

    if (!expression.trim().length) {
        return await replyWithMarkdown(
            "Usage:\n  `/render <latex expression>`",
            { disable_notification: true }
        );
    }

    const imageFilePath = await renderLaTeX(expression);

    await replyWithPhoto({ source: imageFilePath });
});

bot.catch((err) => {
    console.log('[Bot] Ooops', err)
});

bot.launch();
