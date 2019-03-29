let SHEMAR;
// PLAYER ONE
let SHIP;
// PLAYER TWO

let ulTag = document.querySelector('#list')
let nameFound = false;

let playerOneScore = 0;
let playerTwoScore = 0;

let playerOneName;
let playerTwoName;
let winningPlayerName;
let winningPlayer;

let users = ""
let li;
let BULLET;
let LIZARD;
let lizardCount = 0;
let lizardPenalty = 0;
let timerAdjustLizard = 0

let GRAVITY = 0.8;
let GROUND_Y = 670;
let JUMP = -20; // how powerful is jump?

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

let gameFont;

let jumpSwitch = true;
let jumpCount = 0;
let timer = 60
let bullets = []
let rainA = [];

let yoff = 0.0

const playerOne = {
  // SPECS FOR PLAYER 1
  x: 400,
  y: 650,
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



const sidebar = document.querySelector(".sidebar");

const btn = document.querySelector(".sidebar-btn");

const links = document.querySelector(".sidebar ul");

const arrow1 = document.querySelector(".sidebar-btn span:nth-child(1)");

const arrow2 = document.querySelector(".sidebar-btn span:nth-child(2)");

const arrow3 = document.querySelector(".sidebar-btn span:nth-child(3)");


function togglemenu() {

  sidebar.classList.toggle("visible");

  btn.classList.toggle("open");

  links.classList.toggle("display");

  arrow1.classList.toggle("topRotate");

  arrow3.classList.toggle("buttomRotate");

  arrow2.classList.toggle("arrow");

}