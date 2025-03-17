// Inicijalizacija Telegram Web App-a
Telegram.WebApp.ready();

// Početne vrednosti
let serverCrystals = 50000000;
let playerResources = { crystals: 0, metal: 0, energy: 0 };
let storageCapacity = 1000;
let storedCrystals = 0;
let fleet = { scouts: 0, cruisers: 0, battleships: 0 };
let miningDrones = 0;
let passiveIncome = 0;
let miningLevel = 1;
let shieldLevel = 0;
let actionsInProgress = [];
let eventActive = null;

const planets = [
    { id: 1, x: 50, y: 50, type: 'crystal', resources: { crystals: 10000, metal: 5000, energy: 2000 }, owner: null, defense: 0 },
    { id: 2, x: 150, y: 100, type: 'empty', resources: { crystals: 0, metal: 1000, energy: 500 }, owner: null, defense: 0 },
    { id: 3, x: 250, y: 200, type: 'strategic', resources: { crystals: 2000, metal: 3000, energy: 4000 }, owner: null, defense: 0 }
];

let leaderboard = [{ name: 'You', crystals: 0 }];

// Ažuriranje prikaza
function updateDisplay() {
    document.getElementById('server-crystals').innerText = serverCrystals;
    document.getElementById('player-crystals').innerText = playerResources.crystals;
    document.getElementById('player-metal').innerText = playerResources.metal;
    document.getElementById('player-energy').innerText = playerResources.energy;
    document.getElementById('storage').innerText = `${storedCrystals}/${storageCapacity}`;
    document.getElementById('scouts').innerText = fleet.scouts;
    document.getElementById('cruisers').innerText = fleet.cruisers;
    document.getElementById('battleships').innerText = fleet.battleships;
    document.getElementById('drones').innerText = miningDrones;
    document.getElementById('passive-income').innerText = passiveIncome;
    document.getElementById('upgrade-btn').disabled = miningLevel >= 5;
    document.getElementById('actions-progress').innerText = actionsInProgress.length > 0 ? actionsInProgress.join(', ') : 'None';
    document.getElementById('events').innerText = eventActive ? eventActive : 'None';
    leaderboard[0].crystals = playerResources.crystals;
    document.getElementById('leaderboard').innerHTML = leaderboard.map(p => `${p.name}: ${p.crystals} Crystals`).join('<br>');

    // Animacija kristalnog polja
    const crystalField = document.getElementById('crystal-field');
    if (serverCrystals > 0) {
        crystalField.style.boxShadow = '0 0 20px #00ff00';
    } else {
        crystalField.style.boxShadow = '0 0 10px #ff0000';
        crystalField.style.background = 'radial-gradient(circle, #ff0000, #640000)';
    }
}

// Tapkanje za kristale
function tapCrystal() {
    if (serverCrystals > 0) {
        serverCrystals -= miningLevel;
        playerResources.crystals += miningLevel;
        storedCrystals = Math.min(playerResources.crystals, storageCapacity);
        updateDisplay();
        const crystalField = document.getElementById('crystal-field');
        crystalField.style.transform = 'scale(1.2)';
        setTimeout(() => crystalField.style.transform = 'scale(1)', 100);
    } else {
        alert("No more crystals left in the galaxy!");
    }
}

// Provera i oduzimanje resursa
function hasResources(cost) {
    return playerResources.crystals >= cost.crystals && playerResources.metal >= cost.metal && playerResources.energy >= cost.energy;
}
function spendResources(cost) {
    playerResources.crystals -= cost.crystals;
    playerResources.metal -= cost.metal;
    playerResources.energy -= cost.energy;
    storedCrystals = Math.min(playerResources.crystals, storageCapacity);
}

// Izgradnja struktura i flote
function buildStorage() {
    const cost = { crystals: 200, metal: 100, energy: 50 };
    if (hasResources(cost)) {
        actionsInProgress.push('Building Storage');
        spendResources(cost);
        setTimeout(() => {
            storageCapacity += 1000;
            actionsInProgress = actionsInProgress.filter(a => a !== 'Building Storage');
            updateDisplay();
        }, 10000);
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

function buildScout() {
    const cost = { crystals: 100, metal: 150, energy: 50 };
    if (hasResources(cost)) {
        actionsInProgress.push('Building Scout');
        spendResources(cost);
        setTimeout(() => {
            fleet.scouts += 1;
            actionsInProgress = actionsInProgress.filter(a => a !== 'Building Scout');
            updateDisplay();
        }, 10000);
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

function buildCruiser() {
    const cost = { crystals: 200, metal: 300, energy: 100 };
    if (hasResources(cost)) {
        actionsInProgress.push('Building Cruiser');
        spendResources(cost);
        setTimeout(() => {
            fleet.cruisers += 1;
            actionsInProgress = actionsInProgress.filter(a => a !== 'Building Cruiser');
            updateDisplay();
        }, 15000);
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

function buildBattleship() {
    const cost = { crystals: 500, metal: 700, energy: 300 };
    if (hasResources(cost)) {
        actionsInProgress.push('Building Battleship');
        spendResources(cost);
        setTimeout(() => {
            fleet.battleships += 1;
            actionsInProgress = actionsInProgress.filter(a => a !== 'Building Battleship');
            updateDisplay();
        }, 20000);
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

function buildShield() {
    const cost = { crystals: 300, metal: 400, energy: 200 };
    if (hasResources(cost)) {
        actionsInProgress.push('Building Shield');
        spendResources(cost);
        setTimeout(() => {
            shieldLevel += 1;
            actionsInProgress = actionsInProgress.filter(a => a !== 'Building Shield');
            updateDisplay();
        }, 20000);
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

function buyDrone() {
    const cost = { crystals: 100, metal: 50, energy: 20 };
    if (hasResources(cost)) {
        spendResources(cost);
        miningDrones += 1;
        passiveIncome += miningLevel;
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

function upgradeMining() {
    const cost = { crystals: 500, metal: 300, energy: 200 };
    if (miningLevel < 5 && hasResources(cost)) {
        spendResources(cost);
        miningLevel += 1;
        passiveIncome = miningDrones * miningLevel;
        updateDisplay();
    } else if (miningLevel >= 5) {
        alert("Max mining level reached!");
    } else {
        alert("Not enough resources!");
    }
}

// Pasivni prihod
setInterval(() => {
    if (serverCrystals > 0 && passiveIncome > 0) {
        let mined = Math.min(passiveIncome, serverCrystals);
        serverCrystals -= mined;
        playerResources.crystals += mined;
        storedCrystals = Math.min(playerResources.crystals, storageCapacity);
        updateDisplay();
    }
}, 1000);

// Mapa i interakcija
function generateMap() {
    const map = document.getElementById('map');
    planets.forEach(planet => {
        const div = document.createElement('div');
        div.className = `planet ${planet.type}-planet`;
        div.style.left = `${planet.x}px`;
        div.style.top = `${planet.y}px`;
        div.title = `${planet.type.charAt(0).toUpperCase() + planet.type.slice(1)} Planet (ID: ${planet.id})`;
        div.onclick = () => interactWithPlanet(planet);
        if (planet.owner === 'player') {
            div.style.border = '2px solid #ffd700';
        }
        map.appendChild(div);
    });
}

function interactWithPlanet(planet) {
    const actionsDiv = document.getElementById('actions');
    actionsDiv.innerHTML = '';
    
    if (!planet.owner) {
        const colonizeBtn = document.createElement('button');
        colonizeBtn.innerText = 'Colonize (300C, 200M, 100E, 20s)';
        colonizeBtn.onclick = () => colonizePlanet(planet);
        actionsDiv.appendChild(colonizeBtn);
    } else if (planet.owner !== 'player') {
        const raidBtn = document.createElement('button');
        raidBtn.innerText = 'Raid (10s)';
        raidBtn.disabled = fleet.scouts + fleet.cruisers + fleet.battleships === 0;
        raidBtn.onclick = () => raidPlanet(planet);
        actionsDiv.appendChild(raidBtn);
    }
}

function colonizePlanet(planet) {
    const cost = { crystals: 300, metal: 200, energy: 100 };
    if (hasResources(cost)) {
        actionsInProgress.push(`Colonizing Planet ${planet.id}`);
        spendResources(cost);
        setTimeout(() => {
            planet.owner = 'player';
            playerResources.crystals += planet.resources.crystals;
            playerResources.metal += planet.resources.metal;
            playerResources.energy += planet.resources.energy;
            storedCrystals = Math.min(playerResources.crystals, storageCapacity);
            actionsInProgress = actionsInProgress.filter(a => a !== `Colonizing Planet ${planet.id}`);
            updateDisplay();
            alert(`Colonized Planet ${planet.id}!`);
            generateMap(); // Osvježavanje mape
        }, 20000);
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

function raidPlanet(planet) {
    if (fleet.scouts + fleet.cruisers + fleet.battleships > 0) {
        actionsInProgress.push(`Raiding Planet ${planet.id}`);
        setTimeout(() => {
            let attackPower = fleet.scouts * 10 + fleet.cruisers * 30 + fleet.battleships * 100;
            let defensePower = planet.defense * 50;
            let success = attackPower > defensePower;
            let raidedCrystals = success ? Math.min(Math.floor(attackPower * 2), planet.resources.crystals) : 0;
            if (success) {
                playerResources.crystals += raidedCrystals;
                storedCrystals = Math.min(playerResources.crystals, storageCapacity);
            } else {
                fleet.scouts = Math.max(0, fleet.scouts - Math.floor(planet.defense / 10));
            }
            actionsInProgress = actionsInProgress.filter(a => a !== `Raiding Planet ${planet.id}`);
            updateDisplay();
            alert(success ? `Raided ${raidedCrystals} crystals!` : `Raid failed! Lost some scouts.`);
        }, 10000);
        updateDisplay();
    }
}

// Tržište
function sellCrystals() {
    if (playerResources.crystals >= 100) {
        playerResources.crystals -= 100;
        playerResources.metal += 50;
        storedCrystals = Math.min(playerResources.crystals, storageCapacity);
        updateDisplay();
    } else {
        alert("Not enough crystals!");
    }
}

function buyEnergy() {
    if (playerResources.crystals >= 200) {
        playerResources.crystals -= 200;
        playerResources.energy += 100;
        storedCrystals = Math.min(playerResources.crystals, storageCapacity);
        updateDisplay();
    } else {
        alert("Not enough crystals!");
    }
}

// Galaktički događaji
function triggerEvent() {
    if (!eventActive && Math.random() < 0.1) {
        eventActive = 'Crystal Rain';
        serverCrystals += 10000;
        setTimeout(() => {
            eventActive = null;
            updateDisplay();
        }, 30000);
        updateDisplay();
        alert("Crystal Rain! Extra 10,000 crystals added to the galaxy!");
    } else if (!eventActive && Math.random() < 0.05) {
        eventActive = 'Pirate Invasion';
        setTimeout(() => {
            if (shieldLevel === 0) {
                playerResources.crystals = Math.floor(playerResources.crystals * 0.8);
                storedCrystals = Math.min(playerResources.crystals, storageCapacity);
                alert("Pirates attacked! Lost 20% of crystals.");
            } else {
                alert("Shield protected you from pirates!");
            }
            eventActive = null;
            updateDisplay();
        }, 20000);
        updateDisplay();
        alert("Pirate Invasion incoming! Prepare your defenses!");
    }
}

setInterval(triggerEvent, 30000);

// Inicijalizacija
generateMap();
updateDisplay();