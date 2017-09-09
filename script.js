var canvas = document.getElementById("spacex");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");
var rocketImage = new Image()
var rocketWidth = '60';
var rocketHeight = '60';
var rocketX = (canvas.width - rocketWidth) / 2;
var rocketY = canvas.height - rocketHeight;

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
var speed = 1;

rocketImage.addEventListener('load', drawRocket(), false);
rocketImage.src = 'images/rocket.png'

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


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

function trackKeys() {
    if (rightPressed && rocketX < canvas.width - rocketWidth) {
        rocketX += speed
    }
    else if(leftPressed && rocketX > 0) {
        rocketX -= speed
    }
    if(upPressed && rocketY > 0) {
        rocketY -= speed
    }
    else if(downPressed && rocketY < canvas.height - rocketHeight) {
        rocketY += speed
    }
}

function drawRocket() {
    ctx.beginPath();
    trackKeys();
    ctx.drawImage(rocketImage, rocketX, rocketY)
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRocket();
}

setInterval(draw, 10);
