const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;
const aiSpeed = 6;

let playerScore = 0;
let aiScore = 0;

let upArrowPressed = false;
let downArrowPressed = false;
let zPressed = false;
let sPressed = false;

let paddleY = canvas.height / 2 - paddleHeight / 2;
let aiPaddleY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6;
let ballSpeedY = 4;

function drawPaddle(x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Joueur: ${playerScore}`, 20, 30);
    ctx.fillText(`IA: ${aiScore}`, canvas.width - 100, 30);
}

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision mur haut/bas
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Collision avec le joueur
    if (ballX - ballRadius < paddleWidth) {
        if (ballY > paddleY && ballY < paddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX - ballRadius < 0) {
            aiScore++;
            resetBall();
        }
    }

    // Collision avec l’IA
    if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX + ballRadius > canvas.width) {
            playerScore++;
            resetBall();
        }
    }

    // Contrôle joueur
    if ((upArrowPressed || zPressed) && paddleY > 0) {
        paddleY -= 7;
    } else if ((downArrowPressed || sPressed) && paddleY < canvas.height - paddleHeight) {
        paddleY += 7;
    }

    // IA avancée
    if (aiPaddleY + paddleHeight / 2 < ballY - 10) {
        aiPaddleY += aiSpeed;
    } else if (aiPaddleY + paddleHeight / 2 > ballY + 10) {
        aiPaddleY -= aiSpeed;
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function drawStars() {
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Effet spatial
    drawStars();

    drawPaddle(0, paddleY); // Joueur
    drawPaddle(canvas.width - paddleWidth, aiPaddleY); // IA
    drawBall(ballX, ballY);
    drawScore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Gestion des touches
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') upArrowPressed = true;
    if (e.key === 'ArrowDown') downArrowPressed = true;
    if (e.key.toLowerCase() === 'z') zPressed = true;
    if (e.key.toLowerCase() === 's') sPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') upArrowPressed = false;
    if (e.key === 'ArrowDown') downArrowPressed = false;
    if (e.key.toLowerCase() === 'z') zPressed = false;
    if (e.key.toLowerCase() === 's') sPressed = false;
});

gameLoop();
