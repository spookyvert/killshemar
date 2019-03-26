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
let timer = 120

const playerOne = {
  x: 400,
  y: 390,
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
}

function setup() {
  createCanvas(800, 400);

  fill(0, 255, 0)
  portalSpr = createSprite(portal.x, portal.y, portal.w, portal.h)


  spr1 = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);
  spr1.shapeColor = color(255, 0, 0);
  spr1.velocity.y = 0;
  let temp = new Platform
  let temp2 = new Platform
  let stat = new Platform
  let p = temp.sprite()
  let q = temp2.sprite()
  let s = stat.sprite()

  platformSpr = createSprite(platformX, p.y, p.w, 20)
  platformSpr2 = createSprite(platformX, p.y - 50, p.w, 20)
  staticPlatformSpr = createSprite(200, 220, 40, 20)
}

function draw() {
  background(50);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text("use arrow keys, or SPACE to stop",
    width / 2, height * 0.67);
    textAlign(CENTER, CENTER);

  //timer stuff
  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }
  if (timer != 0){
  textSize(18);
  text(timer + "s", width - 30, 20);
  }

  // if (timer <= 0) {
  //   textSize(18);
  //   textAlign(CENTER, CENTER);
  //   text("SHEMAR WINS");
  // }

  if (spr1.position.y >= 390) {
    spr1.position.y = 390;
  }
  if (spr1.position.x >= 790){
    spr1.position.x = 790;
  }
  if (spr1.position.x <= 10){
    spr1.position.x = 10;
  }

  // // Ground Image
  image(img, 0, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 220, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 450, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 600, GROUND_Y + 15, img.width / 8, img.height / 8);



  if (spr1.collide(staticPlatformSpr)){
    jumpCount = -1;
    jumpSwitch = true;
    spr1.velocity.y = GRAVITY * 2
  }

  if (spr1.collide(platformSpr) || spr1.collide(platformSpr2)){
    jumpCount = -1;
    jumpSwitch = true;
    if ((platformSwitch === false) || (platformSpr2 === false)){
      spr1.velocity.x = -1.5
    }
    else {
      spr1.velocity.x = 1.5
    }
  }

  if (spr1.position.y >= 390){
    spr1.velocity.x = 0
  }

  //limits jumping to 2 consecutive jumps
  if (spr1.position.y >= 370) {
    jumpCount = 0
    jumpSwitch = true
  }

  drawSprites();

  if (spr1.position.y <= 330) {
    spr1.velocity.y += GRAVITY;
  } else if (spr1.position.y >= 390) {
    spr1.velocity.y = 0
  }
  fill(100);

  if (platformSwitch === true) {
    if (platformSpr.position.x >= 850) {
      platformSwitch = false;
    }
    else {
      platformSpr.position.x += 1.5;
    }
  }
  else {
    if (platformSpr.position.x <= -80) {
      platformSwitch = true
    }
    else {
      platformSpr.position.x -= 1.5
    }
  }

  if (platformSwitch2 === true) {
    if (platformSpr2.position.x >= 1850) {
      platformSwitch2 = false;
    }
    else {
      platformSpr2.position.x += 1.5;
    }
  }
  else {
    if (platformSpr2.position.x <= -480) {
      platformSwitch2 = true
    }
    else {
      platformSpr2.position.x -= 1.5
    }
  }

  if (keyIsDown(RIGHT_ARROW) && spr1.position.x < 790) {
    spr1.position.x += 5;
  }
  else if (keyIsDown(LEFT_ARROW) && spr1.position.x > 10) {
    spr1.position.x -= 5;
  }
  return false;
}

function keyPressed() {
  if (keyIsDown(UP_ARROW) && jumpSwitch) {
    if (jumpCount >= 1) {
      jumpSwitch = false
    } else {
      spr1.velocity.y = JUMP;
      jumpCount++
    }
  } else if (keyIsDown(DOWN_ARROW) && spr1.position.x >= 602 && spr1.position.x <= 607 && spr1.position.y === 390) {
    spr1.position.x = 200
    spr1.position.y = 200
  }
  return false;
}
