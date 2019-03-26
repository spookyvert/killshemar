let spr1;
let GRAVITY = 0.8;
let GROUND_Y = 350;
let JUMP = -8; // how powerful is jump?
let img;
let platformSpr;
let platformSwitch;
let jumpSwitch = true;
let jumpCount = 0;
let portalSpr;



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


  let temp = new Platform
  let p = temp.sprite()


  platformSpr = createSprite(platformX, p.y, p.w, 20)

  spr1 = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);
  spr1.shapeColor = color(255, 0, 0);
  spr1.velocity.y = 0;




}

function draw() {
  background(50);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text("use arrow keys, or SPACE to stop",
    width / 2, height * 0.67);

  //limits jumping to 2 consecutive jumps
  if (spr1.position.y >= 370) {
    jumpCount = 0
    jumpSwitch = true
  }

  if (spr1.position.y >= 390) {
    spr1.position.y = 390;
  }

  // // Ground Image
  image(img, 0, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 220, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 450, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 600, GROUND_Y + 15, img.width / 8, img.height / 8);

  spr1.collide(platformSpr)

  drawSprites();

  if (spr1.position.y <= 330) {
    spr1.velocity.y += GRAVITY;
  } else if (spr1.position.y >= 390) {
    spr1.velocity.y = 0
  }
  fill(100);



  if (platformSwitch === true) {
    if (platformSpr.position.x >= 810) {
      platformSwitch = false;
    } else {

      platformSpr.position.x += 1.5;
    }
  } else {
    if (platformSpr.position.x <= 80) {
      platformSwitch = true
    } else {

      platformSpr.position.x -= 1.5
    }
  }





  if (keyIsDown(RIGHT_ARROW) && spr1.position.x < 790) {

    spr1.position.x += 5;


  } else if (keyIsDown(LEFT_ARROW) && spr1.position.x > 10) {
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