var canvas = document.getElementById("spacex");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

var rocketImage = new Image();
var earthImage = new Image();
var rocketWidth = 60;
var rocketHeight = 60;

var earthWidth = canvas.width;
var earthHeight = 100;
var rocketX = (canvas.width - rocketWidth) / 2;
var rocketY = canvas.height - earthHeight - rocketHeight;
var earthX = 0;
var earthY = canvas.height - earthHeight;

// Buttons
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var key = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
}
var rocketSpeed = 2;
var rocketMoveY = 0;
var rocketMoveX = 0;

var asteroids = [];
var asteroidRadius = 20;
var asteroidSpeed = 0.5;

rocketImage.addEventListener('load', drawRocket(), false);
rocketImage.src = 'images/rocket.png';

// earthImage.addEventListener('load', drawEarth(), false);
// earthImage.src = 'images/earth.png';

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function keyDownHandler(e) {
    if(e.keyCode == key.RIGHT) {
        rightPressed = true;
    }
    else if(e.keyCode == key.LEFT) {
        leftPressed = true;
    }
    if(e.keyCode == key.UP) {
        upPressed = true;
    }
    else if(e.keyCode == key.DOWN) {
        downPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == key.RIGHT) {
        rightPressed = false;
    }
    else if(e.keyCode == key.LEFT) {
        leftPressed = false;
    }
    if(e.keyCode == key.UP) {
        upPressed = false;
    }
    else if(e.keyCode == key.DOWN) {
        downPressed = false;
    }
}


function collisionWithEarth(){
    var left = rocketX + rocketMoveX + rocketWidth > earthX;
    var right = rocketX + rocketMoveX < earthX + earthWidth;
    var top = rocketY + rocketHeight + rocketMoveY - 20 > earthY;
    if (left && right && top) {
        return true;
    }
    return false;
}

function trackKeys() {
    rocketMoveX = 0;
    rocketMoveY = 0;
    if (rightPressed && rocketX + rocketSpeed < canvas.width - rocketWidth) {
        rocketMoveX += rocketSpeed
    }
    else if(leftPressed && rocketX - rocketSpeed > 0) {
        rocketMoveX -= rocketSpeed
    }
    if(upPressed && rocketY - rocketSpeed > 0) {
        rocketMoveY -= rocketSpeed
    }
    else if(downPressed && rocketY + rocketSpeed < canvas.height - rocketHeight) {
        rocketMoveY += rocketSpeed
    }
}

function drawRocket() {
    trackKeys();
    if (!collisionWithEarth()) {
        rocketX += rocketMoveX;
        rocketY += rocketMoveY;
    }
    ctx.drawImage(rocketImage, rocketX, rocketY);
}


function createAsteroid() {
    x =  getRandomInt(100, canvas.width - 100);
    y =  0;
    asteroids.push({
        x: x,
        y: y,
    })
}

function drawAsteroids() {
    for (var i = asteroids.length - 1; i >= 0; i--) {
        ctx.beginPath();
        asteroids[i].y += asteroidSpeed;
        ctx.arc(asteroids[i].x, asteroids[i].y, asteroidRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

function drawEarth() {
    ctx.beginPath();
    ctx.rect(earthX, earthY, earthWidth, earthHeight);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEarth();
    drawRocket();
    drawAsteroids();
}

setInterval(draw, 10);
setInterval(createAsteroid, 2000);
