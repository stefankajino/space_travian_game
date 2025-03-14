""
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// 📌 Konekcija sa MongoDB bazom (postavi svoj MongoDB URI u .env fajl)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const PlayerSchema = new mongoose.Schema({
    telegramId: String,
    username: String,
    crystals: { type: Number, default: 0 },
    fleet: { type: Number, default: 0 },
    baseLevel: { type: Number, default: 1 },
    lastMineTime: { type: Number, default: Date.now }
});

const Player = mongoose.model('Player', PlayerSchema);

// 📌 Rudarenje kristala (tapkanje)
app.post('/mine-tap', async (req, res) => {
    const { telegramId } = req.body;
    const player = await Player.findOne({ telegramId });

    if (!player) return res.status(404).json({ error: 'Player not found' });

    const crystalsEarned = Math.floor(Math.random() * 10) + 1;
    player.crystals += crystalsEarned;
    await player.save();

    res.json({ success: true, crystalsEarned, totalCrystals: player.crystals });
});

// 📌 Napad na igrača
app.post('/attack-player', async (req, res) => {
    const { attackerId, defenderId } = req.body;
    const attacker = await Player.findOne({ telegramId: attackerId });
    const defender = await Player.findOne({ telegramId: defenderId });

    if (!attacker || !defender) return res.status(404).json({ error: 'Players not found' });

    const attackTime = Math.floor(Math.random() * 30) + 10;
    setTimeout(async () => {
        if (attacker.fleet > defender.fleet) {
            let stolenCrystals = Math.floor(defender.crystals * 0.3);
            attacker.crystals += stolenCrystals;
            defender.crystals -= stolenCrystals;
            await attacker.save();
            await defender.save();
            io.emit('attackResult', { attackerId, defenderId, success: true, stolenCrystals });
        } else {
            io.emit('attackResult', { attackerId, defenderId, success: false });
        }
    }, attackTime * 1000);

    res.json({ success: true, attackTime });
});
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN); // Uzimamo token iz .env fajla

// 📌 Start komanda - Dugme za pokretanje igre
bot.start((ctx) => {
    ctx.reply('🚀 Welcome to Space Travian!\nClick the button below to start the game.', {
        reply_markup: {
            inline_keyboard: [[
                { text: '🎮 Play Now', web_app: { url: process.env.WEB_APP_URL } }
            ]]
        }
    });
});

// 📌 Pokretanje bota
bot.launch();
console.log('🤖 Telegram bot is running...');
