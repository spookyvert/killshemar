let spr1;
let GRAVITY = 0.8;
let JUMP = -5; // how powerful is jump?
let spr3;

const p1 = {
  x: 400,
  y: 350,
  w: 20,
  h: 20
}

const platform1 = {
  x: 50,
  y: 50,
  w: 40,
  h: 20
}
let platformRight = true;

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

  if (spr1.position.y <= 300){
    spr1.velocity.y += GRAVITY;
  }
  else if (spr1.position.y >= 350){
    spr1.velocity.y = 0
  }
  fill(100);

  rect(platform1.x, 300, 70, 20)
  if (platformRight === true){
    if (platform1.x >= 810){
      platformRight = false;
    }
    else {
      platform1.x += 0.5;
    }
  }
  else {
    if (platform1.x <= 80){
      platformRight = true
    }
    else {
      platform1.x -= 0.5
    }
  }
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    spr1.setSpeed(3.5, 0);
  } else if (keyCode == LEFT_ARROW) {
    spr1.setSpeed(3.5, 180);
  } else if (keyCode == UP_ARROW && spr1.position.y > 290) {
    spr1.velocity.y = JUMP;
  } else if (key == ' ') {
    spr1.setSpeed(0, 0);
  }
  return false;


}
