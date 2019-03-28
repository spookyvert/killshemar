let SHEMAR;
// PLAYER ONE
let SHIP;
// PLAYER TWO

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
let GROUND_Y = 350;
let JUMP = -8; // how powerful is jump?

let PORTAL;

let img;
let bg;
let platform1;
let platform2;
let platformSTATIC;
let rocketImg;
let platformSwitch;
let platformSwitch2;


let jumpSwitch = true;
let jumpCount = 0;
let timer = 60
let bullets = []
let rainA = [];

let yoff = 0.0

//invisibility variables
let invisible = false
let alpha = 255;
let invisibilityCount = 0
let timerAdjustInvisible = false