const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const menu = document.getElementById('menu');

const paddleWidth = 10, paddleHeight = 100, ballRadius = 12;
let paddleY, aiPaddleY, ballX, ballY, ballSpeedX, ballSpeedY;
let playerLives = 3, aiLives = 3, level = 1, aiSpeed = 3;
let gameRunning = false;

let up = false, down = false, z = false, s = false;

function drawHeart(x, y) {
    ctx.font = "24px Quicksand";
    ctx.fillText("❤️", x, y);
}

function drawHUD() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Quicksand';
    for (let i = 0; i < playerLives; i++) drawHeart(20 + i * 30, 30);
    for (let i = 0; i < aiLives; i++) drawHeart(canvas.width - (i + 1) * 30, 30);
    ctx.fillText(`Niveau ${level}`, canvas.width / 2 - 40, 30);
}

function drawPaddle(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffc0cb'; // couleur douce pour la balle
    ctx.fill();
    ctx.closePath();
}

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) ballSpeedY *= -1;

    if (ballX - ballRadius < paddleWidth) {
        if (ballY > paddleY && ballY < paddleY + paddleHeight) ballSpeedX *= -1;
        else {
            aiLives--;
            resetBall();
            if (aiLives <= 0) nextLevel();
        }
    }
    if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) ballSpeedX *= -1;
        else {
            playerLives--;
            resetBall();
            if (playerLives <= 0) endGame();
        }
    }

    if ((up || z) && paddleY > 0) paddleY -= 7;
    if ((down || s) && paddleY < canvas.height - paddleHeight) paddleY += 7;

    if (aiPaddleY + paddleHeight / 2 < ballY - 10) aiPaddleY += aiSpeed;
    if (aiPaddleY + paddleHeight / 2 > ballY + 10) aiPaddleY -= aiSpeed;
}

function nextLevel() {
    level++;
    aiLives = 3 + level; // Augmenter la difficulté avec chaque niveau
    aiSpeed += 0.5;
    resetBall();
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (6 + level);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

function endGame() {
    alert(playerLives <= 0 ? "Vous avez perdu 😢" : "Vous avez gagné 🎉");
    menu.style.display = 'block';
    canvas.style.display = 'none';
    gameRunning = false;
}

function gameLoop() {
    if (gameRunning) {
        update();
        ctx.clearRect(0, 0, canvas.width, canvas.height); // effacer le canvas à chaque frame
        drawBall();
        drawPaddle(0, paddleY, "#ffb3c6");
        drawPaddle(canvas.width - paddleWidth, aiPaddleY, "#ff99cc");
        drawHUD();
        requestAnimationFrame(gameLoop);
    }
}

startButton.addEventListener('click', () => {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    gameRunning = true;
    resetBall();
    gameLoop();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') up = true;
    if (e.key === 'ArrowDown') down = true;
    if (e.key.toLowerCase() === 'z') z = true;
    if (e.key.toLowerCase() === 's') s = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') up = false;
    if (e.key === 'ArrowDown') down = false;
    if (e.key.toLowerCase() === 'z') z = false;
    if (e.key.toLowerCase() === 's') s = false;
});
