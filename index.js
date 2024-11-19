require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

// Parse JSON bodies
app.use(express.json());

const token = process.env.BOT_TOKEN;
const url = process.env.WEBHOOK_URL;
const port = process.env.PORT || 3000;

// Create a bot instance
const bot = new TelegramBot(token);

bot.setWebHook(`${url}/webhook/${token}`);

app.post(`/webhook/${token}`, (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.sendStatus(200);
    }

    handleMessage(message);
    res.sendStatus(200);
});

async function handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;

    // Command handler
    if (text.startsWith('/')) {
        switch(text) {
            case '/start':
                await bot.sendMessage(chatId, 'Welcome! Bot is up and running.');
                break;
            case '/help':
                await bot.sendMessage(chatId, 'Available commands:\n/start - Start the bot\n/help - Show this help message');
                break;
            default:
                await bot.sendMessage(chatId, 'Unknown command. Type /help for available commands.');
        }
        return;
    }

    // Echo messages (replace with your logic)
    try {
        await bot.sendMessage(chatId, `You said: ${text}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});