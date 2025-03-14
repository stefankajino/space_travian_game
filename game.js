let tg = window.Telegram.WebApp;
tg.expand();

// Rudarenje kristala
document.getElementById('mineButton').addEventListener('click', async () => {
    let res = await fetch('http://localhost:5000/mine-tap', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ telegramId: tg.initDataUnsafe.user.id }) 
    });

    let data = await res.json();
    if (data.success) {
        document.getElementById('userCrystals').innerText = data.totalCrystals;
    }
});

// Napad na igrača
document.getElementById('attackButton').addEventListener('click', async () => {
    let res = await fetch('http://localhost:5000/attack-player', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ attackerId: tg.initDataUnsafe.user.id, defenderId: '123456' }) 
    });

    let data = await res.json();
    if (data.success) {
        let timeLeft = data.attackTime;
        let interval = setInterval(() => {
            document.getElementById('attackTimer').innerText = timeLeft;
            timeLeft--;
            if (timeLeft <= 0) clearInterval(interval);
        }, 1000);
    }
});

// Prikaz upozorenja o napadu
const socket = io('http://localhost:5000');
socket.emit('join', tg.initDataUnsafe.user.id);
socket.on('incomingAttack', () => {
    document.getElementById('attackWarning').style.display = 'block';
    setTimeout(() => {
        document.getElementById('attackWarning').style.display = 'none';
    }, 10000);
});
