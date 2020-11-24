
const { config: loadDovEnvFile } = require('dotenv')
const { renderLaTeX } = require('./renderer.js');
const { Telegraf } = require('telegraf');

const TelegrafLogger = require('telegraf-logger');

loadDovEnvFile();

const bot = new Telegraf(process.env.BOT_TOKEN);
const logger = new TelegrafLogger({
    format: '[TelegrafLogger] %ut => @%u %fn %ln: <%ust> "%c"'
});

bot.use(logger.middleware());

bot.command(['render', 'render@latexit_bot'], async ({ message, from, chat, replyWithMarkdown, replyWithPhoto }) => {
    console.log(`[Bot] @${from.username} ${chat.title ? `in "${chat.title}" ` : ''}sent: "${message.text}"`);

    const expression = message.text.replace(/^\/render.*?( |$)/, '');

    if (!expression.trim().length)
        return await replyWithMarkdown("Usage:\n  `/render <latex expression>`", { disable_notification: true });

    const imageFilePath = await renderLaTeX(expression);

    if (!imageFilePath) {
        await replyWithMarkdown("Sorry, I couldn't render the expression", { disable_notification: true });
        
        if (Math.random() < 0.2) 
            await replyWithMarkdown("(better error messages are coming soon)", { disable_notification: true });

        return;
    }

    await replyWithPhoto({ source: imageFilePath });
});

bot.catch((err) => {
    console.log('[Bot] Ooops', err)
});

bot.launch();
