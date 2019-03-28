const playerOne = {
  // SPECS FOR PLAYER 1
  x: 400,
  y: 390,
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
  x: 604,
  y: 390,
  w: 75,
  h: 25
}

let gameStarted;
let team;

function preload() {
  // load images here
  img = loadImage('assets/images/grass.png');
  rocketImg = loadImage('assets/images/rocket.png');
  bg = loadImage('assets/images/background.png');
  bgTop = loadImage('assets/images/topbg.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(0, 255, 0)

  socket = io.connect('http://localhost:8000/')


  // Create an Audio input
  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();

  // set gameStarted equal to false
  gameStarted = false;




  PORTAL = createSprite(portal.x, portal.y, portal.w, portal.h)

  SHEMAR = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);
  SHEMAR.shapeColor = color(255, 0, 0, alpha);
  SHEMAR.velocity.y = 0;

  SHIP = createSprite(playerTwo.x, playerTwo.y, playerTwo.w, playerTwo.h);
  SHIP.addImage(rocketImg)
  SHIP.shapeColor = color(255);
  SHIP.rotateToDirection = true;
  SHIP.maxSpeed = 2;
  SHIP.friction = 0.99;

  let tmp = new Platform
  let tmp2 = new Platform
  let tmp3 = new Platform

  // platform 1
  let p = tmp.sprite()
  // platform 2
  let q = tmp2.sprite()
  // static platform
  let s = tmp.sprite()

  // Player Count
  socket.on('player-number', (data) => {
    if (data == 1) {
      console.log("Player 1 Has Joined")
      console.log("Waiting for Player 2")
    } else if (data == 2) {
      console.log("Player 2 Has Joined")
    } else if (data >= 3) {
      alert("game is full")
    }


  });

  // Team Setter
  socket.on('team', (data) => {

    team = data

  })

  socket.on('startGame', (data) => {
    gameStarted = data.start
  });

  socket.on('mouse', (data) => {
    SHIP.attractionPoint(70, data.x, data.y);
  });

  socket.on('shoot', (data) => {
    BULLET = createSprite(width / 4, height / 4, 2, 10);
    BULLET.velocity.y = data.velocityY;
    BULLET.velocity.x = data.velocityX;
    BULLET.position.x = data.x;
    BULLET.position.y = data.y;

    bullets.push(BULLET)
    console.log('pew')
  });


  socket.on('linearS1', (data) => {

    SHEMAR.position.x = data.x
  });

  socket.on('invisible', (data) => {
    invisible = data.invis,
      alpha = 0,
      invisibilityCount = data.iC,
      timerAdjustInvisible = data.tAI

  });

  socket.on('lizard', (data) => {
    LIZARD = createSprite(400, 0, 20, 20)
    LIZARD.velocity.y = data.yV

  });

  socket.on('jumpS1', (data) => {
    SHEMAR.velocity.y = data.Vy
  });

  socket.on('portal', (data) => {

    SHEMAR.position.y = data.y,
      SHEMAR.position.x = data.x,
      SHEMAR.velocity.x = data.vX,
      SHEMAR.velocity.y = data.vY

  });

  // Socket.io end

  randomDirection()

  platform1 = createSprite(platformX, p.y, p.w, 20)

  let p1Data = {
    x: platformX,
    y: p.y,
    w: p.w
  }
  socket.emit('platform1', p1Data)
  socket.on('platform1', (data) => {
    platform1 = createSprite(data.x, data.y, data.w, 20)
  });

  platform2 = createSprite(platformX, p.y - 50, p.w, 20)

  let plaformData2 = {
    x: platformX,
    y: p.y - 50,
    w: p.w
  }
  socket.emit('platform2', plaformData2)
  socket.on('platform2', (data) => {
    platform2 = createSprite(data.x, data.y, data.w, 20)
  });

  platformSTATIC = createSprite(200, 220, 40, 20)


  // create clear button
  startButton = createButton('Start Game').addClass('start-button');

  sB = document.querySelector('.start-button')

  startButton.position(500, height);

  sB.addEventListener('click', (event) => {
    gameStarted = true;

    let data = {
      start: gameStarted
    }

    socket.emit('startGame', data)

  })
}
// setup() ends here

function draw() {
  background(bg);
  fill(255);
  noStroke();
  let bgWave

  // scene

  rainRun()
  image(bgTop, 0, 0, window.width, window.height);
  groundLayout()

  if (gameStarted == true) {
    startButton.hide();

    if (invisible === true) {
      SHEMAR.shapeColor = color(255, 0, 0, alpha)
      if (alpha < 255) {
        alpha += 0.5
      } else if (alpha === 255) {
        invisible = false
      }
    }

    // shemar controls, weird glitch in mainMovementsDraw(), work here!
    if (keyIsDown(RIGHT_ARROW) && SHEMAR.position.x < 790 && team == 'shemar') {
      SHEMAR.position.x += 10;
    } else if (keyIsDown(LEFT_ARROW) && SHEMAR.position.x > 10 && team == 'shemar') {
      SHEMAR.position.x -= 10;
    }

    let data2 = {
      x: SHEMAR.position.x
    }

    socket.emit('linearS1', data2)

    timerSetter()
    gameLogic()
    drawSprites();

    mainMovementsDraw()

  }

}

//  MOVEMENTS
function keyPressed() {
  mainMovements()
}