const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');


const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;
let upArrowPressed = false;
let downArrowPressed = false;
let paddleY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;
let aiPaddleY = canvas.height / 2 - paddleHeight / 2;
const aiSpeed = 3;


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

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;


    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX - ballRadius < paddleWidth) {
        if (ballY > paddleY && ballY < paddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX - ballRadius < 0) {
            resetBall();
        }
    } else if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else if (ballX + ballRadius > canvas.width) {
            resetBall();
        }
    }


    if (upArrowPressed && paddleY > 0) {
        paddleY -= 7;
    } else if (downArrowPressed && paddleY < canvas.height - paddleHeight) {
        paddleY += 7;
    }

    if (aiPaddleY + paddleHeight / 2 < ballY) {
        aiPaddleY += aiSpeed;
    } else {
        aiPaddleY -= aiSpeed;
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(0, paddleY);
    drawPaddle(canvas.width - paddleWidth, aiPaddleY);
    drawBall(ballX, ballY);
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        upArrowPressed = true;
    } else if (e.key === 'ArrowDown') {
        downArrowPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        upArrowPressed = false;
    } else if (e.key === 'ArrowDown') {
        downArrowPressed = false;
    }
});

gameLoop();

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
