//board
let board;
let boardWidth = 360;
let boardHeight = 640
let context;

//bird
let birdWidth = 39;
let birdHeight = 32;
let birdX = boardWidth/8;
let birdY = boardHeight/2
let birdImg

let bird = {
  x : birdX,
  y : birdY,
  width : birdWidth,
  height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;//pipes moving left speed
let velocityY = 0;//bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function(){
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw bird
  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load img
  birdImg = new Image();
  birdImg.src = "../flappy-bird/flappybird.png";
  birdImg.onload = function(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "../flappy-bird/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
}

function update(){
  requestAnimationFrame(update);
  if(gameOver){
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird //velocity 0, gravity 0.4(계속해서 0.4씩 y축 감소)
  velocityY += gravity;
  // bird.y += velocityY;//space키 누르면 -6씩 상승
  bird.y = Math.max(bird.y + velocityY, 0);//0보다는 작게 만들지 않음
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if(bird.y > board.height){
    gameOver = true;
  }


  //pipes
  for(let i = 0; i < pipeArray.length; i++){
    let pipe = pipeArray[i];
    pipe.x = pipe.x + velocityX;
    // console.log(pipe.x);
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if(!pipe.passed && bird.x > pipe.x + pipe.width){
      score += 0.5;
      pipe.passed = true;
    }

    if(detectCollision(bird, pipe)){
      gameOver = true;
    }
  }

  //clear pipes
  while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
    pipeArray.shift();
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if(gameOver){
    context.fillText("game over", 5, 90);
  }
}

function placePipes(){
  if(gameOver){
    return;
  }
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
  let openingSpace = board.height / 4

  let topPipe = {
    img : topPipeImg,
    x : pipeX,
    y : randomPipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }
  pipeArray.push(topPipe);

  let bottompipe = {
    img : bottomPipeImg,
    x : pipeX,
    y : randomPipeY + pipeHeight + openingSpace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }
  pipeArray.push(bottompipe);
}

function moveBird(e){
  if(e.code == "Space"){
    velocityY = -6;
    //space누르면 y축 -6씩 상승
    if(gameOver){
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}
//a.x = 새의 x축 위치 (새의 왼쪽 기준)
//a.y = 새의 높이(새의 위쪽 기준)
//b.x = 파이프의 x축 위치
//b.y = 파이프의 y축 위치
//a.width = 새의 넓이 34
//a.height = 새의 길이 24
//b.width = 파이프의 넓이 64
//b.height = 파이프의 길이 512

//충돌감지
function detectCollision(a, b){
  return a.x < b.x + b.width &&
  //객체 a의 왼쪽 끝이 객체 b의 오른쪽 끝보다 왼쪽에 있으면서
  //a.x는 a의 왼쪽, a.x + a.width = (a의 왼쪽 + a의 넓이) a의 오른족 끝 
         a.x + a.width > b.x &&
  //객체 a의 오른쪽 끝이 객체 b의 왼쪽 끝보다 오른쪽에 있으면 x축 방향에서 겹친다고 볼 수 있습니다
         a.y < b.y + b.height &&
         a.y + a.height > b.y ;
  //a.y < b.y + b.height: 객체 a의 위쪽 끝이 객체 b의 아래쪽 끝보다 위에 있으면서
  //a.y + a.height > b.y: 객체 a의 아래쪽 끝이 객체 b의 위쪽 끝보다 아래에 있으면 y축 방향에서 겹친다고 볼 수 있습니다
}