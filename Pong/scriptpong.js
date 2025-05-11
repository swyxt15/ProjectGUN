const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let upArrowPressed = false;
let downArrowPressed = false;
let zPressed = false;
let sPressed = false;

let paddleY, aiPaddleY, ballX, ballY, ballSpeedX, ballSpeedY;
let playerLives, aiLives, gameRunning;
let aiSpeed;
let level;
let stars = [];

function initStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            speed: 0.2 + Math.random() * 0.3
        });
    }
}

function updateStars() {
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }
}

function drawStars() {
    ctx.fillStyle = "#ffffff88";
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

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

function drawHUD() {
    const heart = "❤️";
    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Joueur: ${heart.repeat(playerLives)}`, 20, 30);
    ctx.fillText(`IA: ${heart.repeat(aiLives)}`, canvas.width - 160, 30);
    ctx.fillText(`Niveau: ${level}`, canvas.width / 2 - 40, 30);
}

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebond murs
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Joueur
    if (ballX - ballRadius < paddleWidth) {
        if (ballY > paddleY && ballY < paddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX - ballRadius < 0) {
            aiLives--;
            checkGameOver();
            resetBall();
        }
    }

    // IA
    if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX + ballRadius > canvas.width) {
            playerLives--;
            checkGameOver();
            resetBall();
        }
    }

    // Contrôles joueur
    if ((upArrowPressed || zPressed) && paddleY > 0) {
        paddleY -= 7;
    } else if ((downArrowPressed || sPressed) && paddleY < canvas.height - paddleHeight) {
        paddleY += 7;
    }

    // IA intelligente
    if (aiPaddleY + paddleHeight / 2 < ballY - 10) {
        aiPaddleY += aiSpeed;
    } else if (aiPaddleY + paddleHeight / 2 > ballY + 10) {
        aiPaddleY -= aiSpeed;
    }

    updateStars();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawPaddle(0, paddleY);
    drawPaddle(canvas.width - paddleWidth, aiPaddleY);
    drawBall(ballX, ballY);
    drawHUD();
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (6 + level);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

function resetGame() {
    level = 1;
    playerLives = 3;
    aiLives = 3;
    aiSpeed = 4;
    paddleY = canvas.height / 2 - paddleHeight / 2;
    aiPaddleY = canvas.height / 2 - paddleHeight / 2;
    resetBall();
    initStars(25); // moins d’étoiles
}

function checkGameOver() {
    if (playerLives <= 0 || aiLives <= 0) {
        alert(playerLives <= 0 ? "Défaite ! 😵" : "Victoire ! 🚀");
        menu.style.display = 'block';
        canvas.style.display = 'none';
        gameRunning = false;
    } else if (aiLives === 0) {
        // Niveau suivant
        level++;
        aiLives = 3 + level; // IA a + de vie à chaque niveau
        aiSpeed += 0.5;
        resetBall();
    }
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

startButton.addEventListener('click', () => {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    gameRunning = true;
    resetGame();
    gameLoop();
});

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
