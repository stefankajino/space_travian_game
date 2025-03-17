document.addEventListener("DOMContentLoaded", () => {
    let serverCrystals = 50000000;
    let playerCrystals = 0;
    let miningLevel = 1;
    let miningDrones = 0;
    let passiveIncome = 0;
    let lastClaimedReward = null;
    
    function updateDisplay() {
        document.getElementById('server-crystals').innerText = serverCrystals;
        document.getElementById('player-crystals').innerText = playerCrystals;
        document.getElementById('mining-level').innerText = miningLevel;
        document.getElementById('drones').innerText = miningDrones;
        document.getElementById('passive-income').innerText = passiveIncome;
    }
    
    function tapCrystal(event) {
        if (serverCrystals > 0) {
            serverCrystals -= miningLevel;
            playerCrystals += miningLevel;
            showClickEffect(event.clientX, event.clientY);
            updateDisplay();
        } else {
            alert("No more crystals left in the galaxy!");
        }
    }
    
    function showClickEffect(x, y) {
        let effect = document.createElement("div");
        effect.className = "click-effect";
        effect.innerText = "+" + miningLevel;
        effect.style.position = "absolute";
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        effect.style.color = "cyan";
        effect.style.fontSize = "20px";
        effect.style.fontWeight = "bold";
        effect.style.animation = "fadeOut 0.7s ease-out";
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 700);
    }
    
    function upgradeMining() {
        const cost = miningLevel * 1000;
        if (playerCrystals >= cost) {
            playerCrystals -= cost;
            miningLevel += 1;
            passiveIncome += 5;
            updateDisplay();
        } else {
            alert("Not enough crystals!");
        }
    }
    
    function buyDrone() {
        const cost = 500;
        if (playerCrystals >= cost) {
            playerCrystals -= cost;
            miningDrones += 1;
            passiveIncome += 10;
            updateDisplay();
        } else {
            alert("Not enough crystals!");
        }
    }
    
    function claimDailyReward() {
        let today = new Date().toDateString();
        if (lastClaimedReward !== today) {
            playerCrystals += 1000;
            lastClaimedReward = today;
            updateDisplay();
            alert("You received 1000 crystals!");
        } else {
            alert("You already claimed your daily reward!");
        }
    }
    
    setInterval(() => {
        if (serverCrystals > 0 && passiveIncome > 0) {
            serverCrystals -= passiveIncome;
            playerCrystals += passiveIncome;
            updateDisplay();
        }
    }, 1000);
    
    document.getElementById('tap-button').addEventListener('click', tapCrystal);
    document.getElementById('upgrade-btn').addEventListener('click', upgradeMining);
    document.getElementById('buy-drone-btn').addEventListener('click', buyDrone);
    document.getElementById('daily-reward-btn').addEventListener('click', claimDailyReward);
    
    updateDisplay();
});
