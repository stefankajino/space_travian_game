// server.js - Ispravljen kod
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const { Telegraf } = require('telegraf');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

let serverCrystals = 50000000;
const players = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    players[socket.id] = { crystals: 0, miningLevel: 1 };
    
    socket.emit('updateCrystals', { serverCrystals, playerCrystals: players[socket.id].crystals });
    
    socket.on('tap', ({ amount }) => {
        if (serverCrystals >= amount) {
            serverCrystals -= amount;
            players[socket.id].crystals += amount;
            io.emit('updateCrystals', { serverCrystals, playerCrystals: players[socket.id].crystals });
        }
    });
    
    socket.on('disconnect', () => {
        delete players[socket.id];
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});

// game.js - Ispravljen kod
const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    let miningLevel = 1;
    
    function updateDisplay(serverCrystals, playerCrystals) {
        document.getElementById('server-crystals').innerText = serverCrystals;
        document.getElementById('player-crystals').innerText = playerCrystals;
    }
    
    function tapCrystal(event) {
        socket.emit('tap', { amount: miningLevel });
    }
    
    socket.on('updateCrystals', ({ serverCrystals, playerCrystals }) => {
        updateDisplay(serverCrystals, playerCrystals);
    });
    
    document.getElementById('crystal-btn').addEventListener('click', tapCrystal);
});
