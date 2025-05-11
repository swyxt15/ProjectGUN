const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

console.log("test")
let isGameActive = true;

const handleCellClick = (event) => {
	console.log("Cell clciked")
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !isGameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    handleResultValidation();
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        alert(`${currentPlayer} a gagné !`);
        isGameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        alert("Match nul !");
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
};

const restartGame = () => {
	console.log("e")
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    cells.forEach(cell => cell.textContent = "");
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('restart').addEventListener('click', restartGame);

function changeBackgroundColor() {
    let bodyElement = document.body;
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    bodyElement.style.backgroundColor = randomColor;
}



window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const overlay = document.getElementById('overlay');
    overlay.addEventListener('transitionend', () => {
        overlay.remove(); 
    });
});
