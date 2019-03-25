let spr1;
let GRAVITY = 0.8;
let JUMP = -5; // how powerful is jump?

const p1 = {
  x: 400,
  y: 350,
  w: 20,
  h: 20
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
  drawSprites();
  // spr1.velocity.y += GRAVITY;
  if (spr1.position.y <= 300){
    // spr1.velocity.y *= -1
    // spr1.position.y = 350
    spr1.velocity.y += GRAVITY;
  }
  else if (spr1.position.y >= 350){
    spr1.velocity.y = 0
  }

  // if (spr1.y === 345) {
  //   spr1.velocity.y = 1.5
  //   if (spr1.y >= 350){
  //     spr1.velocity.y = 0
  //   }
  // }
  // else{
  //   spr1.velocity.y = 0
  // }
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    spr1.setSpeed(3.5, 0);
  } else if (keyCode == LEFT_ARROW) {
    spr1.setSpeed(3.5, 180);
  } else if (keyCode == UP_ARROW && spr1.position.y > 290) {
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
