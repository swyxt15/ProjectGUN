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

function revealCell(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.classList.contains('revealed')) return;

    cell.classList.add('revealed');

    if (cell.classList.contains('mine')) {
        cell.textContent = '💣';
        revealAllMines();
        alert('💥 Game Over !');
        return;
    } else {
        const adjacentMines = countAdjacentMines(row, col);
        if (adjacentMines > 0) {
            cell.textContent = adjacentMines;
        } else {
            revealAdjacentCells(row, col);
        }
    }

    checkWinCondition();
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
                const neighbor = cells[newRow][newCol];
                if (!neighbor.classList.contains('revealed') && !neighbor.classList.contains('mine')) {
                    neighbor.click();
                }
            }
        }
    }
}

function revealAllMines() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = cells[row][col];
            if (cell.classList.contains('mine')) {
                cell.classList.add('revealed');
                cell.textContent = '💣';
            }
        }
    }
}

function checkWinCondition() {
    let revealedCount = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (cells[row][col].classList.contains('revealed')) {
                revealedCount++;
            }
        }
    }
    const totalCells = ROWS * COLS;
    const nonMineCells = totalCells - MINES;

    if (revealedCount === nonMineCells) {
        revealAllMines();
        setTimeout(() => {
            alert('🎉 Bravo ! Vous avez gagné !');
        }, 100);
    }
}

restartButton.addEventListener('click', createBoard);
createBoard();
