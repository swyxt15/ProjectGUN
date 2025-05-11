const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const menu = document.getElementById('menu');

const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
let paddleY, aiPaddleY, ballX, ballY, ballSpeedX, ballSpeedY;
let playerLives = 3, aiLives = 3, level = 1, aiSpeed = 100;
let up = false, down = false, z = false, s = false;
let gameRunning = false;
let lastTime = 0;

// Facteur de difficulté IA (plus élevé = moins précis)
let aiErrorMargin = 80;

function drawHeart(x, y) {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#ffd6e8";
  ctx.fillText("❤️", x, y);
}

function drawHUD() {
  ctx.fillStyle = '#ffd6e8';
  ctx.font = '18px Arial';
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
  ctx.fillStyle = '#f7a7c0';
  ctx.fill();
  ctx.closePath();
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (250 + level * 30);
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (150 + level * 15);
}

function endGame() {
  const message = playerLives <= 0 ? "Tu as perdu 😢" : "Tu as gagné ! 🏆";
  alert(message);
  gameRunning = false;
  menu.style.display = 'block';
  canvas.style.display = 'none';
}

function nextLevel() {
  level++;
  aiLives = 3 + level;
  aiSpeed += 30;
  aiErrorMargin = Math.max(10, aiErrorMargin - 10); // IA plus précise
  resetBall();
}

function update(dt) {
  ballX += ballSpeedX * dt;
  ballY += ballSpeedY * dt;

  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY *= -1;
  }

  if (ballX - ballRadius <= paddleWidth) {
    if (ballY > paddleY && ballY < paddleY + paddleHeight) {
      ballSpeedX *= -1;
    }
  }

  if (ballX + ballRadius >= canvas.width - paddleWidth) {
    if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
      ballSpeedX *= -1;
    }
  }

  if (ballX - ballRadius < 0) {
    playerLives--;
    resetBall();
    if (playerLives <= 0) endGame();
  }

  if (ballX + ballRadius > canvas.width) {
    aiLives--;
    resetBall();
    if (aiLives <= 0) nextLevel();
  }

  let playerSpeed = 400; // pixels/sec
  if ((up || z) && paddleY > 0) paddleY -= playerSpeed * dt;
  if ((down || s) && paddleY < canvas.height - paddleHeight) paddleY += playerSpeed * dt;

  let aiCenter = aiPaddleY + paddleHeight / 2;
  let targetY = ballY + aiErrorMargin * (Math.random() - 0.5);
  if (aiCenter < targetY - 10) aiPaddleY += aiSpeed * dt;
  else if (aiCenter > targetY + 10) aiPaddleY -= aiSpeed * dt;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(0, paddleY, "#fc9bb3");
  drawPaddle(canvas.width - paddleWidth, aiPaddleY, "#db7093");
  drawHUD();
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(delta);
  draw();

  requestAnimationFrame(gameLoop);
}

startButton.addEventListener('click', () => {
  menu.style.display = 'none';
  canvas.style.display = 'block';
  gameRunning = true;
  playerLives = 3;
  aiLives = 3;
  level = 1;
  aiSpeed = 100;
  aiErrorMargin = 80;
  paddleY = canvas.height / 2 - paddleHeight / 2;
  aiPaddleY = canvas.height / 2 - paddleHeight / 2;
  resetBall();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') up = true;
  if (e.key === 'ArrowDown') down = true;
  if (e.key.toLowerCase() === 'z') z = true;
  if (e.key.toLowerCase() === 's') s = true;
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowUp') up = false;
  if (e.key === 'ArrowDown') down = false;
  if (e.key.toLowerCase() === 'z') z = false;
  if (e.key.toLowerCase() === 's') s = false;
});
