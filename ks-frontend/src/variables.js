let SHEMAR;
// PLAYER ONE
let SHIP;
// PLAYER TWO

let ulTag = document.querySelector('ul')

let playerOneScore = 0;
let playerTwoScore = 0;

let playerOneName;
let playerTwoName;
let winningPlayerName;
let winningPlayer;

let BULLET;
let LIZARD;
let lizardCount = 0;
let lizardPenalty = 0;
let timerAdjustLizard = 0

let GRAVITY = 0.8;
let GROUND_Y = 670;
let JUMP = -8; // how powerful is jump?

let PORTAL;

let img;
let bg;
let platform1;
let platform2;
let platformSTATIC;
let rocketImg;
let lizardImg;
let portalImg;
let platformSwitch;
let platformSwitch2;


let jumpSwitch = true;
let jumpCount = 0;
let timer = 60
let bullets = []
let rainA = [];

let yoff = 0.0

const playerOne = {
  // SPECS FOR PLAYER 1
  x: 400,
  y: 690,
  w: 20,
  h: 20
}

const playerTwo = {
  // SPECS FOR PLAYER 2
  x: 400,
  y: 100,
  w: 20,
  h: 20
}

const portal = {
  // PORTAL SPECS
  x: 900,
  y: 670,
  w: 75,
  h: 25
}

//invisibility variables
let invisible = false
let alpha = 255;
let invisibilityCount = 0
let timerAdjustInvisible = false
