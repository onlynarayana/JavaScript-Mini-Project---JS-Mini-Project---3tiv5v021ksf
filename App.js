/* All Game Variables here */

const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
let hiscoreBox = document.getElementById("hiscoreBox");
const playPauseBtn = document.getElementById("playPause");
const gameoverMessage = document.querySelector(".gameOver");
const gOverBtn = document.getElementById("gOver");
let lastDir = "upside";
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("./music/food.mp3");
const gameOverSound = new Audio("./music/gameover.mp3");
const moveSound = new Audio("./music/move.mp3");
const musicSound = new Audio("./music/music.mp3");
let speed = 5;
let lastPaintTime = 0;
let snakeArray = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let score = 0;
let hscore;
let move = false;

/* Basic Game Functions */

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  gameEngine();
}

/* When Snake is Collide in itself or own body  */

function isCollide(sArr) {
  for (let ind = 1; ind < sArr.length; ind++) {
    if (sArr[0].x === sArr[ind].x && sArr[0].y === sArr[ind].y) {
      return true;
    }
  }
  if (sArr[0].x <= 0 || sArr[0].x >= 18 || sArr[0].y <= 0 || sArr[0].y >= 18)
    return true;
  return false;
}

/* Basic Game Engine and initialising the Game and initial positioning of Snake Head and Food */

function gameEngine() {
  if (isCollide(snakeArray)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir.x = 0;
    inputDir.y = 0;
    speed = 5;
    snakeArray = [{ x: 13, y: 15 }];
    gameoverMessage.style.display = "block";
    // musicSound.play();        /* Optional thing to play background music */
    score = 0;
    pause();
    // location.reload();
  }

  /* if snake eaten food increment the snake length and regenerate the food  also increases the speed of snake too */

  if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
    foodSound.play();
    musicSound.play();
    score += 1;
    speed += 0.05;
    if (score > hscore) {
      hscore = score;
      hiscoreBox.textContent = "HiScore : " + hscore;
      localStorage.setItem("highScore", String(hscore));
    }
    scoreBox.innerText = "Score : " + score;
    snakeArray.unshift({
      x: snakeArray[0].x + inputDir.x,
      y: snakeArray[0].y + inputDir.y,
    });
    let a = 2,
      b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  /* Movement of The Snake */

  if (move) {
    for (let i = snakeArray.length - 2; i >= 0; i--) {
      snakeArray[i + 1] = { ...snakeArray[i] };
    }
    snakeArray[0].x += inputDir.x;
    snakeArray[0].y += inputDir.y;
  }

  /*  Display or Render the snake */

  board.innerHTML = "";
  snakeArray.forEach((ele, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = ele.y;
    snakeElement.style.gridColumnStart = ele.x;
    if (index === 0) snakeElement.classList.add("head");
    else snakeElement.classList.add("tail");
    board.appendChild(snakeElement);
  });

  /* Display the food */

  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

/* saving and getting high Score from browser local Storage */

let highScore = localStorage.getItem("highScore");
if (!highScore) {
  hscore = 0;
  localStorage.setItem("highscore", "0");
} else {
  hscore = Number(highScore);
  hiscoreBox.textContent = "HiScore : " + hscore;
}

/* main logic for eventListener on keypressing  */

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  // console.log(e.key);
  moveSound.play();
  if (e.key === "ArrowUp") goUp();
  else if (e.key === "ArrowDown") goDown();
  else if (e.key === "ArrowLeft") goLeft();
  else if (e.key === "ArrowRight") goRight();
  else if (e.key === " ") {
    if (!move) go();
    else pause();
  } else return;
});

function goUp() {
  if (lastDir === "downside") return;
  inputDir.x = 0;
  inputDir.y = -1;
  lastDir = "upside";
  // document.getElementById('up').style.backgroundColor = '';
  play();
}
function goDown() {
  if (lastDir === "upside") return;
  inputDir.x = 0;
  inputDir.y = 1;
  lastDir = "downside";
  play();
}
function goLeft() {
  if (lastDir === "rightside") return;
  inputDir.x = -1;
  inputDir.y = 0;
  lastDir = "leftside";
  play();
}
function goRight() {
  if (lastDir === "leftside") return;
  inputDir.x = 1;
  inputDir.y = 0;
  lastDir = "rightside";
  play();
}
function go() {
  if (lastDir === "upside") goUp();
  else if (lastDir === "downside") goDown();
  else if (lastDir === "leftside") goLeft();
  else if (lastDir === "rightside") goRight();
}

function play() {
  move = true;
  playPauseBtn.setAttribute("src", "./Images/pausebtn.png");
}
function pause() {
  move = false;
  playPauseBtn.setAttribute("src", "./Images/playbtn.png");
  musicSound.pause();
}

document.querySelector(".dpad").addEventListener("click", function (e) {
  let eid = e.target.id;
  if (eid === "up") goUp();
  else if (eid === "down") goDown();
  else if (eid === "left") goLeft();
  else if (eid === "right") goRight();
  else if (eid === "playPause") {
    if (playPauseBtn.getAttribute("src") === "./Images/playbtn.png") go();
    else pause();
  } else return;
});

/* for handling the touch events on the Screen touch phone Feature */

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches;
}
window.onscroll = function (e) {
  e.preventDefault();
  window.scrollTo(0, 0);
};

function handleTouchStart(evt) {
  evt.preventDefault();
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  evt.preventDefault();

  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /* most significant */
    if (xDiff > 0) {
      goLeft(); /* right swipe */
    } else {
      goRight(); /* left swipe */
    }
  } else {
    if (yDiff > 0) {
      goUp(); /* down swipe */
    } else {
      goDown(); /* up swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

gOverBtn.addEventListener("click", function (e) {
  gameoverMessage.style.display = "none";
  location.reload();
});
