let spr1;
let GRAVITY = 0.8;
let GROUND_Y = 350;
let JUMP = -8; // how powerful is jump?
let img;
let platformSpr;
let platformSwitch;



const playerOne = {
  x: 400,
  y: 390,
  w: 20,
  h: 20
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


  spr1 = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);
  spr1.shapeColor = color(255, 0, 0);
  spr1.velocity.y = 0;
  let temp =  new Platform
  let p = temp.sprite()
  

  platformSpr = createSprite(platformX, p.y, p.w, 20)



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


  spr1.collide(platformSpr)


  if (keyIsDown(RIGHT_ARROW)) {

    spr1.position.x += 5;


  } else if (keyIsDown(LEFT_ARROW)) {
    spr1.position.x -= 5;

  } else if (keyIsDown(UP_ARROW) && spr1.position.y > 330) {
    // playerOne.y -= 100
    spr1.velocity.y = JUMP;
  } else if (key == ' ') {
    spr1.setSpeed(0, 0);
  }
  return false;

}