let spr1;
let GRAVITY = 0.8;
let GROUND_Y = 350;
let JUMP = -8; // how powerful is jump?
let img;
let platformSpr;
let platformSpr2;
let staticPlatformSpr;
let platformSwitch;
let platformSwitch2;
let jumpSwitch = true;
let jumpCount = 0;
let portalSpr;
let timer = 60
let rocketImg;
let bulletSpr;
let bg;
let bullets = []
let socket


const playerOne = {
  x: 400,
  y: 390,
  w: 20,
  h: 20
}

const playerTwo = {
  x: 400,
  y: 100,
  w: 20,
  h: 20
}

const portal = {
  x: 604,
  y: 390,
  w: 25,
  h: 25
}

platformSwitch = false;
platformSwitch2 = true;
// helper methods
function randomDirection() {
  return (Math.floor(Math.random() * 2) == 0) ? platformX = 20 : platformX = 800;
}

randomDirection()

function preload() {
  img = loadImage('assets/grass.png');
  rocketImg = loadImage('assets/rocket.png');
  bg = loadImage('assets/background.jpg')
}



function setup() {
  createCanvas(800, 400);


  //
  socket = io.connect('http://localhost:8000/')


  fill(0, 255, 0)
  portalSpr = createSprite(portal.x, portal.y, portal.w, portal.h)

  // Player One
  spr1 = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);
  spr1.shapeColor = color(255, 0, 0);
  spr1.velocity.y = 0;


  // Player Two
  spr2 = createSprite(playerTwo.x, playerTwo.y, playerTwo.w, playerTwo.h);
  spr2.addImage(rocketImg)
  spr2.shapeColor = color(255);
  spr2.rotateToDirection = true;
  spr2.maxSpeed = 2;
  spr2.friction = 0.99;

  let temp = new Platform
  let temp2 = new Platform
  let stat = new Platform
  let p = temp.sprite()
  let q = temp2.sprite()
  let s = stat.sprite()


  socket.on('mouse', (data) => {
    spr2.attractionPoint(70, data.x, data.y);

  });




  socket.on('shoot', (data) => {
    bulletSpr = createSprite(width / 4, height / 4, 2, 10);


    bulletSpr.velocity.y = data.velocityY;
    bulletSpr.velocity.x = data.velocityX;
    bulletSpr.position.x = data.x;
    bulletSpr.position.y = data.y;
    bullets.push(bulletSpr)

    console.log(0)


  });



  socket.on('linearS1', (data) => {
    spr1.position.x = data.x

  });


  socket.on('jumpS1', (data) => {


    spr1.position.y = data.y,
      spr1.position.x = data.x,
      spr1.velocity.x = data.vX,
      spr1.velocity.y = data.vY

  });



  platformSpr = createSprite(platformX, p.y, p.w, 20)

  let plaformData1 = {
    x: platformX,
    y: p.y,
    w: p.w

  }
  socket.emit('platform1', plaformData1)


  socket.on('platform1', (data) => {
    platformSpr = createSprite(data.x, data.y, data.w, 20)

  });

  platformSpr2 = createSprite(platformX, p.y - 50, p.w, 20)

  let plaformData2 = {
    x: platformX,
    y: p.y - 50,
    w: p.w

  }
  socket.emit('platform2', plaformData2)

  socket.on('platform2', (data) => {
    platformSpr2 = createSprite(data.x, data.y, data.w, 20)

  });


  staticPlatformSpr = createSprite(200, 220, 40, 20)

}

function draw() {
  background(bg);
  fill(255);
  noStroke();

  // // Ground Image
  image(img, 0, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 220, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 450, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 600, GROUND_Y + 15, img.width / 8, img.height / 8);

  // Regular Movement
  if (keyIsDown(RIGHT_ARROW) && spr1.position.x < 790) {
    spr1.position.x += 5;
  } else if (keyIsDown(LEFT_ARROW) && spr1.position.x > 10) {
    spr1.position.x -= 5;
  }



  // PLAYER TWO CLICK MOVEMENT
  if (mouseIsPressed) {

    // THIS SENDS IT TO THE SERVER, OTHER SERVER
    let data = {
      x: mouseX,
      y: mouseY
    }
    socket.emit('mouse', data)



    spr2.attractionPoint(70, mouseX, mouseY);

  }


  //timer stuff
  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }
  if (timer != 0) {
    textSize(18);
    text(timer + "s", width - 30, 20);
  }

  if (timer <= 0) {
    textSize(20);
    textAlign(CENTER, CENTER);
    text("SHEMAR WINS", width / 2, 20);
  }

  if (spr1.position.y >= 390) {
    spr1.position.y = 390;
  }
  if (spr1.position.x >= 790) {
    spr1.position.x = 790;
  }
  if (spr1.position.x <= 10) {
    spr1.position.x = 10;
  }

  //player 1 platform collisions
  if (spr1.collide(staticPlatformSpr)) {
    jumpCount = -1;
    jumpSwitch = true;
    spr1.velocity.y = GRAVITY * 2
  }

  if (spr1.collide(platformSpr) || spr1.collide(platformSpr2)) {
    jumpCount = -1;
    jumpSwitch = true;
    if ((platformSwitch === false) || (platformSpr2 === false)) {
      spr1.velocity.x = -1.5
    } else {
      spr1.velocity.x = 1.5
    }
  }

  if (spr1.position.y >= 390) {
    spr1.velocity.x = 0
  }

  //player 2 ship collisions
  if (spr2.collide(staticPlatformSpr) || spr2.collide(platformSpr) || spr2.collide(platformSpr2)) {
    timer = 0;
  }
  if (spr2.collide(spr1)) {
    textSize(20);
    textAlign(CENTER, CENTER);
    text("SHIP WINS", width / 2, 20);
    noLoop();
  }

  if (bullets.length != 0) {
    for (let b of bullets) {
      if (b.collide(spr1)) {
        textSize(20);
        textAlign(CENTER, CENTER);
        text("SHIP WINS", width / 2, 20);
        noLoop();
      } else if (b.collide(staticPlatformSpr) || b.collide(platformSpr) || b.collide(platformSpr2)) {
        b.remove()
      }
    }
  }



  //limits jumping to 2 consecutive jumps
  if (spr1.position.y >= 370) {
    jumpCount = 0
    jumpSwitch = true
  }

  drawSprites();

  // LOGIC TO NOT FALL THROUGH GROUND
  if (spr1.position.y <= 330) {
    spr1.velocity.y += GRAVITY;
  } else if (spr1.position.y >= 390) {
    spr1.velocity.y = 0
  }

  // PLATFORM 1 LOGIC
  if (platformSwitch === true) {
    if (platformSpr.position.x >= 850) {
      platformSwitch = false;
    } else {
      platformSpr.position.x += 1.5;
    }
  } else {
    if (platformSpr.position.x <= -80) {
      platformSwitch = true
    } else {
      platformSpr.position.x -= 1.5
    }
  }

  // PLATFORM 2 LOGIC
  if (platformSwitch2 === true) {
    if (platformSpr2.position.x >= 1850) {
      platformSwitch2 = false;
    } else {
      platformSpr2.position.x += 1.5;
    }
  } else {
    if (platformSpr2.position.x <= -480) {
      platformSwitch2 = true
    } else {
      platformSpr2.position.x -= 1.5
    }
  }


  // Movement


  if (keyIsDown(RIGHT_ARROW) && spr1.position.x < 790) {
    spr1.position.x += 5;
  } else if (keyIsDown(LEFT_ARROW) && spr1.position.x > 10) {
    spr1.position.x -= 5;
  }


  let dataS1 = {
    x: spr1.position.x,
  }
  socket.emit('linearS1', dataS1)


}

// SPECIAL MOVEMENTS
function keyPressed() {
  // PLAYER ONE CONTROLS
  if (keyIsDown(UP_ARROW) && jumpSwitch) {
    if (jumpCount >= 1) {
      jumpSwitch = false
    } else {
      spr1.velocity.y = JUMP;

      jumpCount++

      let dataS1 = {
        x: spr1.position.x,
        y: spr1.position.y,
        vY: spr1.velocity.y,
        vX: spr1.velocity.x

      }

      socket.emit('jumpS1', dataS1)

    }


  } else if (keyIsDown(DOWN_ARROW) && spr1.position.x >= 602 && spr1.position.x <= 607 && spr1.position.y === 390) {
    spr1.position.x = 200
    spr1.position.y = 200

    // PLAYER TWO CONTROLS
  } else if (keyIsDown(32)) {



    bulletSpr = createSprite(width / 4, height / 4, 2, 10);

    bulletSpr.velocity.y = 2;
    bulletSpr.velocity.x = random(-1, 1);
    bulletSpr.position.x = spr2.position.x;
    bulletSpr.position.y = spr2.position.y;
    bullets.push(bulletSpr)

    let data = {
      x: bulletSpr.position.x,
      y: bulletSpr.position.y,
      velocityY: bulletSpr.velocity.y,
      velocityX: bulletSpr.velocity.x

    }


    socket.emit('shoot', data)




  }

}