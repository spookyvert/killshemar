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

function preload() {
  // load images here
  img = loadImage('assets/grass.png');
  rocketImg = loadImage('assets/rocket.png');
  bg = loadImage('assets/background.jpg')
}

function setup() {
  createCanvas(800, 400);
  fill(0, 255, 0)

  socket = io.connect('http://localhost:8000/')


  PORTAL = createSprite(portal.x, portal.y, portal.w, portal.h)

  SHEMAR = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);
  SHEMAR.shapeColor = color(255, 0, 0);
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


  // Socket.io

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
    SHEMAR.position.x = data.x,
      SHEMAR.position.y = data.x
  });

  socket.on('jumpS1', (data) => {
    SHEMAR.position.x = data.x,
      SHEMAR.position.y = data.y


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

}
// setup() ends here

function draw() {
  background(bg);
  fill(255);
  noStroke();

  // Ground
  groundLayout()

  // Regular Movement
  if (keyIsDown(RIGHT_ARROW) && SHEMAR.position.x < 790) {
    SHEMAR.position.x += 1;
  } else if (keyIsDown(LEFT_ARROW) && SHEMAR.position.x > 10) {
    SHEMAR.position.x -= 1;
  }



  // PLAYER TWO CLICK MOVEMENT
  if (mouseIsPressed) {
    // THIS SENDS IT TO THE SERVER, OTHER SERVER
    let data = {
      x: mouseX,
      y: mouseY
    }
    socket.emit('mouse', data)

    SHIP.attractionPoint(70, mouseX, mouseY);
  }


  timerSetter()
  gameLogic()
  drawSprites();

  // Movement / Socket.io
  if (keyIsDown(RIGHT_ARROW) && SHEMAR.position.x < 790) {
    SHEMAR.position.x += 5;
  } else if (keyIsDown(LEFT_ARROW) && SHEMAR.position.x > 10) {
    SHEMAR.position.x -= 5;
  }

  let data2 = {
    x: SHEMAR.position.x,
    y: SHEMAR.position.y
  }
  socket.emit('linearS1', data2)

}

//  MOVEMENTS
function keyPressed() {
  mainMovements()
}