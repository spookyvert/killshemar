let spr1;
let GRAVITY = 1;
let JUMP = 25; // how powerful is jump?

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
  spr1.shapeColor = color(255);
}

function draw() {
  background(50);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text("use arrow keys, or SPACE to stop",
    width / 2, height * 0.67);
  drawSprites();
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    spr1.setSpeed(3.5, 0);
  } else if (keyCode == LEFT_ARROW) {
    spr1.setSpeed(3.5, 180);
  } else if (keyCode == UP_ARROW) {
    console.log("jump")
    // JUMP
    // spr1.setSpeed(1.5, 270);

  } else if (key == ' ') {
    spr1.setSpeed(0, 0);
  }
  return false;


}