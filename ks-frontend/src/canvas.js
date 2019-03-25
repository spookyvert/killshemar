let spr1;
let GRAVITY = 0.8;
let GROUND_Y = 350;
let JUMP = -5; // how powerful is jump?
let img;


const p1 = {
  x: 400,
  y: 390,
  w: 20,
  h: 20
}

function preload() {
  img = loadImage('assets/grass.png');
}

function setup() {
  createCanvas(800, 400);

  spr1 = createSprite(
    p1.x, p1.y, p1.w, p1.h);
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





  // Ground Image
  image(img, 0, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 220, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 450, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 600, GROUND_Y + 15, img.width / 8, img.height / 8);

  drawSprites();

  // spr1.velocity.y += GRAVITY;
  if (spr1.position.y <= 330) {
    // spr1.velocity.y *= -1
    // spr1.position.y = 350
    spr1.velocity.y += GRAVITY;
  } else if (spr1.position.y >= 390) {
    spr1.velocity.y = 0
  }


}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    spr1.setSpeed(3.5, 0);
  } else if (keyCode == LEFT_ARROW) {
    spr1.setSpeed(3.5, 180);
  } else if (keyCode == UP_ARROW && spr1.position.y > 330) {
    // p1.y -= 100
    spr1.velocity.y = JUMP;
    // spr1.velocity.y += GRAVITY;
    // if (spr1.y === 345) {
    //   spr1.velocity.y = 1.5
    //   if (spr1.y >= 350){
    //     spr1.velocity.y = 0
    //   }
    // }



  } else if (key == ' ') {
    spr1.setSpeed(0, 0);
  }
  return false;


}