let spr1;
let GRAVITY = 0.8;
let GROUND_Y = 350;
let JUMP = -8;
let img;
let platformSpr;
let platformSwitch;
let jumpSwitch = true;
let jumpCount = 0;

const p1 = {
  x: 400,
  y: 390,
  w: 20,
  h: 20
}

const platform1 = {
  x: 50,
  y: 40,
  w: 40,
  h: 20
}

const portal = {
  x: 604,
  y: 390,
  w: 25,
  h: 25
}

function randomDirection() {
  return (Math.floor(Math.random() * 2) == 0) ? platformSwitch = true : platformSwitch = false;
}

randomDirection()

function preload() {
  img = loadImage('assets/grass.png');
}

function setup() {
  createCanvas(800, 400);
  fill(0, 255, 0)
  portalSpr = createSprite(portal.x, portal.y, portal.w, portal.h)


  let r = random(650);



  spr1 = createSprite(
    p1.x, p1.y, p1.w, p1.h);
  spr1.shapeColor = color(255, 0, 0);
  spr1.velocity.y = 0;

  fill(0, 200, 0)
  platformSpr = createSprite(r, 330, 70, 20)

}

function draw() {
  background(50);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text("use arrow keys, or SPACE to stop",
    width / 2, height * 0.67);

  // // Ground Image
  image(img, 0, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 220, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 450, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 600, GROUND_Y + 15, img.width / 8, img.height / 8);

  drawSprites();

  if (spr1.position.y <= 330) {
    spr1.velocity.y += GRAVITY;
  }
  else if (spr1.position.y >= 390) {
    spr1.velocity.y = 0
  }

//limits jumping to 2 consecutive jumps
  if (spr1.position.y >= 370){
    jumpCount = 0
    jumpSwitch = true
  }


  if (spr1.position.y >= 390){
    spr1.position.y = 390;
  }

  if (platformSwitch === true) {
    if (platformSpr.position.x >= 810) {
      platformSwitch = false;
    } else {

      platformSpr.position.x += 1.5;
    }
  }
  else {
    if (platformSpr.position.x <= 80) {
      platformSwitch = true
    }
    else {
      platformSpr.position.x -= 1.5
    }
  }

  spr1.collide(platformSpr)



  if (keyIsDown(RIGHT_ARROW) && spr1.position.x < 790) {
    spr1.position.x += 5;
  }
  else if (keyIsDown(LEFT_ARROW) && spr1.position.x > 10) {
    spr1.position.x -= 5;
  }
  return false;
}

function keyPressed(){
  if (keyIsDown(UP_ARROW) && jumpSwitch) {
    if (jumpCount >= 1){
      jumpSwitch = false
    }
    else {
    spr1.velocity.y = JUMP;
    jumpCount++
    }
  }
  else if (keyIsDown(DOWN_ARROW) && spr1.position.x >= 602 && spr1.position.x <= 607 && spr1.position.y === 390) {
    spr1.position.x = 200
    spr1.position.y = 200
  }
  return false;
}
