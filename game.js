// Inicijalizacija Telegram Web App-a
Telegram.WebApp.ready();

// Početne vrednosti
let serverCrystals = 50000000;
let playerCrystals = 0;
let storageCapacity = 5000;
let miningLevel = 1;
let miningDrones = 0;
let passiveIncome = 0;
let actionsInProgress = [];
let eventActive = null;
let baseLevel = 1;

// Pragovi kristala za nadogradnju baze
const baseThresholds = [0, 5000, 20000, 50000, 150000, 500000];
const baseImages = [
    'lvl_1.png',
    'lvl_2.png',
    'lvl_3.png',
    'lvl_4.png',
    'lvl_5.png'
];

// Ažuriranje prikaza
function updateDisplay() {
    document.getElementById('server-crystals').innerText = serverCrystals;
    document.getElementById('player-crystals').innerText = `${playerCrystals} / ${storageCapacity}`;
    document.getElementById('mining-level').innerText = miningLevel;
    document.getElementById('drones').innerText = miningDrones;
    document.getElementById('passive-income').innerText = passiveIncome;
    document.getElementById('upgrade-btn').disabled = miningLevel >= 5;
    document.getElementById('actions-progress').innerText = actionsInProgress.length > 0 ? actionsInProgress.join(', ') : 'None';
    document.getElementById('events').innerText = eventActive ? eventActive : 'None';
    
    // Ažuriranje nivoa baze
    updateBaseLevel();

    // Animacija kristalnog polja
    const crystalField = document.getElementById('crystal-field');
    crystalField.style.boxShadow = serverCrystals > 0 ? '0 0 20px #00ffff' : '0 0 10px #ff0000';
}

// Tapkanje za kristale
function tapCrystal() {
    if (serverCrystals > 0) {
        serverCrystals -= miningLevel;
        playerCrystals = Math.min(playerCrystals + miningLevel, storageCapacity);
        updateDisplay();
        const crystalField = document.getElementById('crystal-field');
        crystalField.style.transform = 'scale(1.2)';
        setTimeout(() => crystalField.style.transform = 'scale(1)', 100);
    } else {
        alert("No more crystals left in the galaxy!");
    }
}

// Nadogradnja baze
function updateBaseLevel() {
    for (let i = baseThresholds.length - 1; i >= 0; i--) {
        if (playerCrystals >= baseThresholds[i]) {
            baseLevel = i + 1;
            document.getElementById('base-image').src = baseImages[i];
            break;
        }
    }
}

// Nadogradnja rudarenja
function upgradeMining() {
    const cost = miningLevel * 1000;
    if (playerCrystals >= cost && miningLevel < 5) {
        playerCrystals -= cost;
        miningLevel += 1;
        passiveIncome = miningDrones * miningLevel;
        updateDisplay();
    } else {
        alert("Not enough crystals or max level reached!");
    }
}

function buyDrone() {
    const cost = 500;
    if (playerCrystals >= cost) {
        playerCrystals -= cost;
        miningDrones += 1;
        passiveIncome += miningLevel;
        updateDisplay();
    } else {
        alert("Not enough crystals!");
    }
}

// Pasivno rudarenje
setInterval(() => {
    if (serverCrystals > 0 && passiveIncome > 0) {
        let mined = Math.min(passiveIncome, serverCrystals);
        serverCrystals -= mined;
        playerCrystals = Math.min(playerCrystals + mined, storageCapacity);
        updateDisplay();
    }
}, 1000);

// Galaktički događaji
function triggerEvent() {
    if (!eventActive && Math.random() < 0.1) {
        eventActive = 'Crystal Storm';
        serverCrystals += 10000;
        setTimeout(() => {
            eventActive = null;
            updateDisplay();
        }, 30000);
        updateDisplay();
        alert("Crystal Storm! Extra 10,000 crystals added to the galaxy!");
    }
}
setInterval(triggerEvent, 30000);

// UI Inicijalizacija
document.getElementById('tap-button').addEventListener('click', tapCrystal);
document.getElementById('upgrade-btn').addEventListener('click', upgradeMining);
document.getElementById('buy-drone-btn').addEventListener('click', buyDrone);
updateDisplay();
