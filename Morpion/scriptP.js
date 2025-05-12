const cells = document.querySelectorAll('.cell');
const statusDisplay = document.createElement("p");
statusDisplay.id = "status";
document.body.insertBefore(statusDisplay, document.getElementById('game'));

let currentPlayer = '🕹️';
let nextPlayer = '👾';
let gameState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function updateStatus() {
    statusDisplay.textContent = isGameActive ? `Tour de ${currentPlayer}` : '';
}

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameState[index] !== "" || !isGameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) return;
    if (checkDraw()) return;

    // Switch players
    [currentPlayer, nextPlayer] = [nextPlayer, currentPlayer];
    updateStatus();
}

function checkWin() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] && 
            gameState[a] === gameState[b] && 
            gameState[a] === gameState[c]
        ) {
            condition.forEach(i => cells[i].classList.add('winning-cell'));
            statusDisplay.textContent = `${currentPlayer} a gagné !`;
            isGameActive = false;
            return true;
        }
    }
    return false;
}

function checkDraw() {
    if (!gameState.includes("")) {
        statusDisplay.textContent = "Match nul !";
        isGameActive = false;
        return true;
    }
    return false;
}

function restartGame() {
    currentPlayer = '🕹️';
    nextPlayer = '👾';
    gameState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('winning-cell');
    });
    updateStatus();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('restart').addEventListener('click', restartGame);

// Overlay transition
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    const overlay = document.getElementById('overlay');
    overlay.addEventListener('transitionend', () => overlay.remove());
    updateStatus();
});
