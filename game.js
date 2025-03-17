// Inicijalizacija Telegram Web App-a
Telegram.WebApp.ready();

// Početne vrednosti
let serverCrystals = 50000000;
let playerResources = { crystals: 0, metal: 0, energy: 0 };
let storageCapacity = 1000;
let storedCrystals = 0;
let fleetCount = 0;
let miningDrones = 0;
let passiveIncome = 0;
let miningLevel = 1;
let actionsInProgress = [];

// Planete na mapi
const planets = [
    { id: 1, x: 50, y: 50, type: 'crystal', resources: { crystals: 10000, metal: 5000, energy: 2000 }, owner: null },
    { id: 2, x: 150, y: 100, type: 'empty', resources: { crystals: 0, metal: 1000, energy: 500 }, owner: null },
    { id: 3, x: 250, y: 200, type: 'strategic', resources: { crystals: 2000, metal: 3000, energy: 4000 }, owner: null }
];

// Ažuriranje prikaza
function updateDisplay() {
    document.getElementById('server-crystals').innerText = serverCrystals;
    document.getElementById('player-crystals').innerText = playerResources.crystals;
    document.getElementById('player-metal').innerText = playerResources.metal;
    document.getElementById('player-energy').innerText = playerResources.energy;
    document.getElementById('storage').innerText = `${storedCrystals}/${storageCapacity}`;
    document.getElementById('fleet').innerText = fleetCount;
    document.getElementById('drones').innerText = miningDrones;
    document.getElementById('passive-income').innerText = passiveIncome;
    document.getElementById('upgrade-btn').disabled = miningLevel >= 5;
    document.getElementById('actions-progress').innerText = actionsInProgress.length > 0 ? actionsInProgress.join(', ') : 'None';
}

// Tapkanje za kristale
function tapCrystal() {
    if (serverCrystals > 0) {
        serverCrystals -= miningLevel;
        playerResources.crystals += miningLevel;
        storedCrystals = Math.min(playerResources.crystals, storageCapacity);
        updateDisplay();
    } else {
        alert("No more crystals left in the galaxy!");
    }
}

// Provera resursa
function hasResources(cost) {
    return playerResources.crystals >= cost.crystals && playerResources.metal >= cost.metal && playerResources.energy >= cost.energy;
}

// Oduzimanje resursa
function spendResources(cost) {
    playerResources.crystals -= cost.crystals;
    playerResources.metal -= cost.metal;
    playerResources.energy -= cost.energy;
    storedCrystals = Math.min(playerResources.crystals, storageCapacity);
}

// Izgradnja skladišta (vremenski zasnovano)
function buildStorage() {
    const cost = { crystals: 200, metal: 100, energy: 50 };
    if (hasResources(cost)) {
        actionsInProgress.push('Building Storage');
        spendResources(cost);
        setTimeout(() => {
            storageCapacity += 1000;
            actionsInProgress = actionsInProgress.filter(a => a !== 'Building Storage');
            updateDisplay();
        }, 10000); // 10 sekundi
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

// Izgradnja flote (vremenski zasnovano)
function buildFleet() {
    const cost = { crystals: 150, metal: 200, energy: 100 };
    if (hasResources(cost)) {
        actionsInProgress.push('Building Fleet');
        spendResources(cost);
        setTimeout(() => {
            fleetCount += 1;
            actionsInProgress = actionsInProgress.filter(a => a !== 'Building Fleet');
            updateDisplay();
        }, 15000); // 15 sekundi
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

// Kupovina rudarskih dronova
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

// Unapređenje rudarenja
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

// Generisanje i interakcija sa mapom
function generateMap() {
    const map = document.getElementById('map');
    planets.forEach(planet => {
        const div = document.createElement('div');
        div.className = `planet ${planet.type}-planet`;
        div.style.left = `${planet.x}px`;
        div.style.top = `${planet.y}px`;
        div.title = `${planet.type} Planet (ID: ${planet.id})`;
        div.onclick = () => interactWithPlanet(planet);
        map.appendChild(div);
    });
}

// Interakcija sa planetama
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
        raidBtn.disabled = fleetCount === 0;
        raidBtn.onclick = () => raidPlanet(planet);
        actionsDiv.appendChild(raidBtn);
    }
}

// Kolonizacija planete
function colonizePlanet(planet) {
    const cost = { crystals: 300, metal: 200, energy: 100 };
    if (hasResources(cost)) {
        actionsInProgress.push(`Colonizing Planet ${planet.id}`);
        spendResources(cost);
        setTimeout(() => {
            planet.owner = 'player';
            playerResources.metal += planet.resources.metal;
            playerResources.energy += planet.resources.energy;
            actionsInProgress = actionsInProgress.filter(a => a !== `Colonizing Planet ${planet.id}`);
            updateDisplay();
            alert(`Colonized Planet ${planet.id}!`);
        }, 20000); // 20 sekundi
        updateDisplay();
    } else {
        alert("Not enough resources!");
    }
}

// Pljačka planete
function raidPlanet(planet) {
    if (fleetCount > 0) {
        actionsInProgress.push(`Raiding Planet ${planet.id}`);
        setTimeout(() => {
            let raidedCrystals = Math.min(Math.floor(Math.random() * 500 * fleetCount), planet.resources.crystals);
            playerResources.crystals += raidedCrystals;
            storedCrystals = Math.min(playerResources.crystals, storageCapacity);
            actionsInProgress = actionsInProgress.filter(a => a !== `Raiding Planet ${planet.id}`);
            updateDisplay();
            alert(`Raided ${raidedCrystals} crystals from Planet ${planet.id}!`);
        }, 10000); // 10 sekundi
        updateDisplay();
    }
}

// Inicijalizacija
generateMap();
updateDisplay();