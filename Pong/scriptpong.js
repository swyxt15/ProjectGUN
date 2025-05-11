const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const menu = document.getElementById('menu');

const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
let paddleY, aiPaddleY, ballX, ballY, ballSpeedX, ballSpeedY;
let playerLives = 3, aiLives = 3, level = 1, aiSpeed = 3;
let up = false, down = false, z = false, s = false;
let gameRunning = false;

// Dessiner un cœur pour les vies
function drawHeart(x, y) {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#ffd6e8";
  ctx.fillText("❤️", x, y);
}

// Dessiner l'interface du jeu (score et vies)
function drawHUD() {
  ctx.fillStyle = '#ffd6e8';
  ctx.font = '18px Arial';
  for (let i = 0; i < playerLives; i++) drawHeart(20 + i * 30, 30);
  for (let i = 0; i < aiLives; i++) drawHeart(canvas.width - (i + 1) * 30, 30);
  ctx.fillText(`Niveau ${level}`, canvas.width / 2 - 40, 30);
}

// Dessiner le paddle (joueur ou IA)
function drawPaddle(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Dessiner la balle
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#f7a7c0';
  ctx.fill();
  ctx.closePath();
}

// Réinitialiser la balle après un point
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (4 + level);
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (2 + level * 0.3);
}

// Fin du jeu
function endGame() {
  const message = playerLives <= 0 ? "Tu as perdu 😢" : "Tu as gagné ! 🏆";
  alert(message);
  gameRunning = false;
  menu.style.display = 'block';
  canvas.style.display = 'none';
}

// Passer au niveau suivant
function nextLevel() {
  level++;
  aiLives = 3 + level;
  aiSpeed += 0.4;
  resetBall();
}

// Mettre à jour la position de la balle et des paddles
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Vérifier les collisions avec les murs du haut et du bas
  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY *= -1;
  }

  // Vérifier les collisions avec le paddle du joueur
  if (ballX - ballRadius <= paddleWidth) {
    if (ballY > paddleY && ballY < paddleY + paddleHeight) {
      ballSpeedX *= -1;
    }
  }

  // Vérifier les collisions avec le paddle de l'IA
  if (ballX + ballRadius >= canvas.width - paddleWidth) {
    if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
      ballSpeedX *= -1;
    }
  }

  // Si la balle dépasse à gauche (joueur perd une vie)
  if (ballX - ballRadius < 0) {
    playerLives--;
    resetBall();
    if (playerLives <= 0) endGame();
  }

  // Si la balle dépasse à droite (IA perd une vie)
  if (ballX + ballRadius > canvas.width) {
    aiLives--;
    resetBall();
    if (aiLives <= 0) nextLevel();
  }

  // Contrôles du joueur (flèche haut / bas ou Z / S)
  if ((up || z) && paddleY > 0) paddleY -= 6;
  if ((down || s) && paddleY < canvas.height - paddleHeight) paddleY += 6;

  // IA qui suit la balle
  if (aiPaddleY + paddleHeight / 2 < ballY - 10) aiPaddleY += aiSpeed;
  if (aiPaddleY + paddleHeight / 2 > ballY + 10) aiPaddleY -= aiSpeed;
}

// Dessiner la scène
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(0, paddleY, "#fc9bb3"); // Paddle joueur
  drawPaddle(canvas.width - paddleWidth, aiPaddleY, "#db7093"); // Paddle IA
  drawHUD();
}

// Boucle de jeu
function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Lancer le jeu
startButton.addEventListener('click', () => {
  menu.style.display = 'none';
  canvas.style.display = 'block';
  gameRunning = true;
  playerLives = 3;
  aiLives = 3;
  level = 1;
  aiSpeed = 3;
  paddleY = canvas.height / 2 - paddleHeight / 2;
  aiPaddleY = canvas.height / 2 - paddleHeight / 2;
  resetBall();
  gameLoop();
});

// Contrôles du joueur
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
