const ROWS = 10;
const COLS = 10;
const MINES = 10;

const board = document.getElementById('game-board');
const restartButton = document.getElementById('restart-button');
let cells = [];

function createBoard() {
    board.innerHTML = '';
    cells = [];
    for (let row = 0; row < ROWS; row++) {
        const rowCells = [];
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', revealCell);
            board.appendChild(cell);
            rowCells.push(cell);
        }
        cells.push(rowCells);
    }
    placeMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        if (!cells[row][col].classList.contains('mine')) {
            cells[row][col].classList.add('mine');
            minesPlaced++;
        }
    }
}


const clickSound = new Audio('https://www.myinstants.com/media/sounds/coin.mp3');
clickSound.volume = 0.3;
clickSound.play();


function revealCell(event) {
    const clickSound = new Audio('sons/click.mp3'); 
    clickSound.play();

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.classList.contains('revealed')) return;

    cell.classList.add('revealed');

    if (cell.classList.contains('mine')) {
        cell.textContent = '💥';
        cell.style.backgroundColor = '#aa3d1e';
        alert('💀 Boom ! Tu as marché sur une mine dans le désert...');
        revealAllMines();
    } else {
        const adjacentMines = countAdjacentMines(row, col);
        if (adjacentMines > 0) {
            cell.textContent = adjacentMines;
            cell.style.color = '#5e3d18';
        } else {
            revealAdjacentCells(row, col);
        }
    }
}


function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                if (cells[newRow][newCol].classList.contains('mine')) {
                    count++;
                }
            }
        }
    }
    return count;
}

function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                if (!cells[newRow][newCol].classList.contains('revealed')) {
                    cells[newRow][newCol].click();
                }
            }
        }
    }
}

function revealAllMines() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (cells[row][col].classList.contains('mine')) {
                cells[row][col].classList.add('revealed');
                cells[row][col].textContent = '💣';
            }
        }
    }
}

restartButton.addEventListener('click', createBoard);
createBoard();


window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    const overlay = document.getElementById('overlay');
    overlay.addEventListener('transitionend', () => {
        overlay.remove(); 
    });
});



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
