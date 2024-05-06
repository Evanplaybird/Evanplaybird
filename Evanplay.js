let Evanplay;
let EvanplayWidth = 800;
let EvanplayHeight = 720;
let context;
let birdWidth = 50;
let birdHeight = 50;
let birdX = EvanplayWidth/8;
let birdY = EvanplayHeight/2;
let birdImg;
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}
let pipeArray = [];
let pipeWidth = 100;
let pipeHeight = 720;
let pipeX = EvanplayWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;
let score = 0;
let game1;
let moveBird1 = true;
window.onload = function(){
    Evanplay = document.getElementById("Evanplay");
    Evanplay.height = EvanplayHeight;
    Evanplay.width = EvanplayWidth;
    context = Evanplay.getContext("2d");
    birdImg = new Image();
    birdImg.src = "./Face.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./Pipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./Pipe.png";
    requestAnimationFrame(update);
    setInterval(placePipes, 4500);
    Evanplay.addEventListener("mousedown", moveBird2, { once: true });
    Evanplay.addEventListener("mousedown", moveBird);
    game1 = Evanplay.getContext("2d");
}
function update(){
    requestAnimationFrame(update);
    if (moveBird1){
        return;
    }
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, Evanplay.width, Evanplay.height);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    if (bird.y > Evanplay.height){
        gameOver = true;
    }
    for (let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }
        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }
    while (pipeArray.length > 0 && pipeArray[0].x < 0){
        pipeArray.shift();
    }
    context.fillStyle = "white";
    context.font="50px 'Courier New', Courier, monospace";
    context.fillText(score, 5, 45);
    if (gameOver){
        game1.fillStyle = "blue";
        game1.font="50px 'Courier New', Courier, monospace";
        game1.fillText("GAME OVER", 280, 430);
    }
}
function placePipes(){
    if (moveBird1){
        return;
    }
    if (gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = Evanplay.height/4
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}
function moveBird(upbird){
    if (upbird.button == 0){
        velocityY = -6;
        if (gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}
function moveBird2(upbird1){
    if (upbird1.button == 0){
        moveBird1 = false;
    }
}
function detectCollision(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}
