let gameStarted;
let team;

let spreadsheet1
let spritedata1
let animationLeft = []

let spreadsheet2
let spritedata2
let animationRight = []
let count = 0

function preload() {
  //font
  gameFont = loadFont('assets/fonts/PressStart2P.ttf');
  // load images here
  spritedata1 = loadJSON('assets/shemar/left.json')
  spritesheet1 = loadImage('assets/shemar/left.png')

  spritedata2 = loadJSON('assets/shemar/right.json')
  spritesheet2 = loadImage('assets/shemar/right.png')

  jumpImg = loadImage('assets/shemar/up.png')

  img = loadImage('assets/images/grass.png');
  fameImg = loadImage('assets/images/fame.png');

  bulletImg = loadImage('assets/images/bullet.png');
  rocketImg = loadImage('assets/images/rocket.png');
  lizardImg = loadImage('assets/images/lizard.png');
  portalImg = loadImage('assets/images/portal.gif');
  rockImg = loadImage('assets/images/rock.png');
  cloudImg = loadImage('assets/images/cloud.png');
  bg = loadImage('assets/images/background.png');
  bgTop = loadImage('assets/images/topbg.png');

}

function setup() {
  createCanvas(windowWidth, windowHeight);





  // Create an Audio input
  mic = new p5.AudioIn();
  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start();

  // set gameStarted equal to false
  gameStarted = false;



  PORTAL = createSprite(portal.x, portal.y, portal.w, portal.h)
  PORTAL.addImage(portalImg)

  ROCK = createSprite(portal.x + 890, portal.y + 30, portal.w, portal.h)
  ROCK.addImage(rockImg)


  SHEMAR = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);

  let leftFrames = spritedata1.frames
  let rightFrames = spritedata2.frames

  for (i in leftFrames) {
    let pos = leftFrames[i].position

    let img = spritesheet1.get(pos.x, pos.y, pos.w, pos.h);
    animationLeft.push(img)
  }

  for (i in rightFrames) {
    let pos = rightFrames[i].position

    let img = spritesheet2.get(pos.x, pos.y, pos.w, pos.h);
    animationRight.push(img)
  }

  // being used?
  // SHEMAR.shapeColor = color(255, 0, 0, alpha);
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

  // Player Limit Checker
  socket.on('player-number', (data) => {
    if (data == 1) {
      console.log("Player 1 Has Joined")
      console.log("Waiting for Player 2")
    } else if (data == 2) {
      console.log("Player 2 Has Joined")

    } else if (data >= 3) {
      alert("Game is Full!")
    }

  });

  // team assigner
  socket.on('team', (data) => {
    team = data
    // puts Team( either ship or shemar ) name in Input box!
    document.querySelector('input').id += team;
  })

  socket.on('startGame', (data) => {
    gameStarted = data.start
  });

  socket.on('mouse', (data) => {
    SHIP.attractionPoint(70, data.x, data.y);
  });

  socket.on('shoot', (data) => {
    BULLET = createSprite(width / 4, height / 4, 2, 10);
    BULLET.addImage(bulletImg)
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

    SHEMAR.hide()
    // invisible = data.invis,
    //   alpha = 0,
    //   invisibilityCount = data.iC,
    //   timerAdjustInvisible = data.tAI

  });

  socket.on('lizard', (data) => {
    LIZARD = createSprite(400, 0, 20, 20)
    LIZARD.addImage(lizardImg, width, height)
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

  // socket.io end

  // platforms + socket.io
  // platforms come from different directions!
  randomDirection()

  platform1 = createSprite(platformX, p.y + random(100, 150), p.w, 20)
  platform1.addImage(cloudImg)

  let p1Data = {
    x: platformX,
    y: p.y,
    w: p.w
  }
  socket.emit('platform1', p1Data)

  socket.on('platform1', (data) => {
    // platform1 = createSprite(data.x, data.y, data.w, 20)
    platform1.position.x = data.x
    platform1.position.w = data.y
    platform1.width = data.w
    platform1.shapeColor = color(0, 255, 0);

  });

  platform2 = createSprite(platformX, p.y + random(150, 200), p.w, 20)
  platform2.addImage(cloudImg)

  let plaformData2 = {
    x: platformX,
    y: p.y - 50,
    w: p.w
  }
  socket.emit('platform2', plaformData2)

  socket.on('platform2', (data) => {
    platform2.position.x = data.x
    platform2.position.w = data.y
    platform2.width = data.w

    platform2.shapeColor = color(255, 0, 0);
  });

  platformSTATIC = createSprite(276, 355, 60, 20)
  platformSTATIC.addImage(cloudImg)

  // platforms + socket.io end

  // create clear button

  titleLogo = createElement('p', '🔪 Kill 🔪<br><br> Shemar').addClass('title')
  titleLogo.position(windowWidth / 2.5, 200);



  textH = createElement('h4', 'what is your name?');
  textH.position(windowWidth / 2.26, 300);

  input = createInput()
  input.position(windowWidth / 2.23, 350);

  startButton = createButton('Start Game').addClass('eightbit-btn eightbit-btn--reset');
  startButton.position(windowWidth / 2.18, 390);
  // start button
  sB = document.querySelector('.eightbit-btn')

  // starts the game!
  sB.addEventListener('click', (event) => {
    gameStarted = true;

    i = document.querySelector('input')
    console.log("Player Name: " + input.value() + " " + i.id);


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

  SHEMAR.addImage(animationLeft[count])


  // scene
  wave()
  rainRun()
  image(bgTop, 0, 0, window.width, window.height);
  groundLayout()

  if (gameStarted == true) {

    textH.hide();
    input.hide();
    startButton.hide();
    titleLogo.hide();
    menuBtn = document.querySelector('.sidebar-btn')
    menuBtn.style.display = 'block'


    if (invisible === true) {
      SHEMAR.shapeColor = color(255, 0, 0, alpha)
      if (alpha < 255) {
        alpha += 0.5
      } else if (alpha === 255) {
        invisible = false
      }
    }

    // shemar controls, weird glitch in mainMovementsDraw(), work here!
    if (keyIsDown(RIGHT_ARROW) && SHEMAR.position.x < windowWidth - 260 && team == 'shemar') {
      SHEMAR.addImage(animationRight[count])
      SHEMAR.position.x += 10;
      tmpCount = count
      tmpCount++
      if (tmpCount >= 3) {
        tmpCount = 0
      }
      count = tmpCount;

    } else if (keyIsDown(LEFT_ARROW) && SHEMAR.position.x > 10 && team == 'shemar') {
      SHEMAR.addImage(animationLeft[count])
      SHEMAR.position.x -= 10;
      tmpCount = count
      tmpCount++
      if (tmpCount >= 3) {
        tmpCount = 0
      }
      count = tmpCount;
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

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }