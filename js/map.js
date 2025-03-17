document.addEventListener("DOMContentLoaded", () => {
    const mapBtn = document.getElementById("map-btn");
    const mapModal = document.getElementById("map-modal");
    const closeMap = document.getElementById("close-map");
    const canvas = document.getElementById("map-canvas");
    const ctx = canvas.getContext("2d");

    const mapSize = 600;
    const sectors = 10; // 10x10 grid
    let playerBase = null;

    function generatePlayerBase() {
        const x = Math.floor(Math.random() * sectors) * (mapSize / sectors);
        const y = Math.floor(Math.random() * sectors) * (mapSize / sectors);
        playerBase = { x, y };
    }

    function drawMap() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = "cyan";
        for (let i = 0; i < sectors; i++) {
            for (let j = 0; j < sectors; j++) {
                ctx.strokeRect(i * (mapSize / sectors), j * (mapSize / sectors), mapSize / sectors, mapSize / sectors);
            }
        }

        // Draw player's base
        if (playerBase) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(playerBase.x + 10, playerBase.y + 10, 20, 20);
        }
    }

    mapBtn.addEventListener("click", () => {
        mapModal.style.display = "block";
        drawMap();
    });

    closeMap.addEventListener("click", () => {
        mapModal.style.display = "none";
    });

    generatePlayerBase();
});

