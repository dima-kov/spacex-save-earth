var canvas = document.getElementById("spacex");

canvas.width = 800;
canvas.height = 600;

var ctx = canvas.getContext("2d");

var rocketImage = new Image();
var earthImage = new Image();
var fireImage = new Image();
var skyImage = new Image();
var asteroidImage = new Image();

var gameSound = new Audio("sounds/music.mp3");
var fireSound = new Audio("sounds/fire.wav");
var explosionSound = new Audio("sounds/explosion.wav");
var collisionSound = new Audio("sounds/collision.mp3");
var rocketWidth = 60;
var rocketHeight = 60;

var earthWidth = canvas.width;
var earthHeight = 100;
var rocketX = (canvas.width - rocketWidth) / 2;
var rocketY = canvas.height - earthHeight - rocketHeight + 80;
var earthX = 0;
var earthY = canvas.height - earthHeight;

// Buttons
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var key = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
}
var rocketSpeed = 4;
var rocketMoveY = 0;
var rocketMoveX = 0;

var asteroids = [];
var asteroidWidth = 40;
var asteroidHeight = 46;
var asteroidSpeedMin = 0.1;
var asteroidSpeedMax = 1;

var bullets = []
var bulletSpeed = 5;
var bulletWidth = 15;

var score = 0;

var rocketImageLoaded = false;
var fireImageLoaded = false;
var skyImageLoaded = false;
var asteroidImageLoaded = false;
var earthImageLoaded = false;
var imagesLoaded = false;

rocketImage.src = 'images/rocket.png';
rocketImage.onload = function () {
    console.log('loadded rocket!'), rocketImageLoaded = true}

fireImage.onload = function () {fireImageLoaded = true}
fireImage.src = 'images/fire.png';

skyImage.onload = function () {skyImageLoaded = true}
skyImage.src = 'images/star-sky.jpg';

asteroidImage.onload = function () {asteroidImageLoaded = true}
asteroidImage.src = 'images/asteroid.png';

earthImage.onload = function () {earthImageLoaded = true}
earthImage.src = 'images/surface.png';


function loadImages() {
    if (rocketImageLoaded && fireImageLoaded && skyImageLoaded && asteroidImageLoaded && earthImageLoaded) {
        gamePreStart();
        clearInterval(loadImagesInterval);
    }
}
var loadImagesInterval = setInterval(loadImages, 10);


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
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
    if (e.keyCode == key.SPACE) {
        if (gameMode == 'play') {
            fire();
        }
        else {
            game();
        }
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
    var top = rocketY + rocketHeight + rocketMoveY - 80 > earthY;
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

function checkAsteroidCollisions() {
    for (var i = asteroids.length - 1; i >= 0; i--) {
        asteroidX = asteroids[i].x;
        asteroidY = asteroids[i].y;
        if (asteroidY >= earthY) {
            collisionSound.play();
            game('stop');
        }
        collTop = asteroidY + asteroidHeight > rocketY;
        collRight = asteroidX < rocketX + rocketWidth;
        collBottom = asteroidY - asteroidHeight < rocketY + rocketHeight;
        collLeft = asteroidX + asteroidWidth > rocketX;
        if (collLeft && collRight && collBottom && collTop) {
            collisionSound.play();
            game('stop');
        }

        for (var j = bullets.length - 1; j >= 0; j--) {
            bulletX = bullets[j].x;
            bulletY = bullets[j].y;

            collRight = bulletX <= asteroidX + asteroidWidth;
            collBottom = bulletY < asteroidY + asteroidHeight;
            collLeft = bulletX + bulletWidth >= asteroidX;
            if (collRight && collBottom && collLeft) {
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                score += 1;
                explosionSound.play();
                if (asteroids.length < 3) {
                    createAsteroid();
                }
            }
        }
    }
}
function asteroidSpeed() {
    return getRandomInt(asteroidSpeedMin, asteroidSpeedMax)
}
function drawAsteroids() {
    for (var i = asteroids.length - 1; i >= 0; i--) {
        ctx.beginPath();
        asteroids[i].y += asteroidSpeed();
        ctx.drawImage(asteroidImage, asteroids[i].x, asteroids[i].y)
        ctx.closePath();
    }
    checkAsteroidCollisions();
}

function createBullet(x, y) {
    bullets.push({
        x:x,
        y:y,
    });
}

function drawBullets() {
    for (var i = bullets.length - 1; i >= 0; i--) {
        ctx.beginPath();
        bullets[i].y -= bulletSpeed;
        ctx.drawImage(fireImage, bullets[i].x - bulletWidth/2, bullets[i].y - 25);
        ctx.closePath();
    }
}

var lastFire;
function fire() {
    var date = new Date();
    currentTime = date.getTime();
    if (!lastFire || currentTime - lastFire > 200) {
        createBullet(rocketX + rocketWidth/4, rocketY);
        lastFire = currentTime;
        fireSound.play();
    }
}

function drawEarth() {
    ctx.beginPath();
    ctx.drawImage(earthImage, earthX, earthY)
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: "+ score, 25, 40);
}

function drawSky() {
    ctx.beginPath();
    ctx.drawImage(skyImage, 0, 0);
    ctx.closePath();
}

function draw() {
    console.log('draw');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawEarth();
    drawRocket();
    drawAsteroids();
    drawBullets();
    drawScore();
}

var gameInterval;
var gameMode = undefined;
function game(mode='start') {
    if (mode == 'start') {
        gameMode = 'play';
        gameSound.play();
        gameInterval = setInterval(draw, 10);
        setInterval(createAsteroid, 2000);
    }
    else if (mode == 'stop') {
        gameMode = 'stop';
        clearInterval(gameInterval);
    }
}

function gamePreStart() {
    draw();
    ctx.beginPath();
    ctx.fillStyle = "rgba(251, 250, 248, 0.55)";
    ctx.rect(0,0, 800, 600);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "34px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Save Earth", canvas.width / 2.8, canvas.height / 5);
    ctx.font = "24px Arial";
    ctx.fillText("You should save the planet from asteroids.", canvas.width / 5, canvas.height / 3.8);
    ctx.fillText("Use controls (UP, DOWN, RIGHT and LEFT) to move ", canvas.width / 9, canvas.height / 2.1);
    ctx.fillText("and SPACEBAR to fire.", canvas.width / 3, canvas.height / 1.85);

    ctx.fillText("You need to get 50 score points to win!", canvas.width / 4.3, canvas.height / 1.4);

    ctx.font = "20px Arial";
    ctx.fillText("Press spacebar to start", canvas.width / 2.7, canvas.height / 1.25);
    ctx.closePath();
}
