// helper methods and variables

platformSwitch = false;
platformSwitch2 = true;


function randomDirection() {
  return (Math.floor(Math.random() * 2) == 0) ? platformX = 20 : platformX = 800
}

function groundLayout() {
  return
  image(img, 0, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 220, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 450, GROUND_Y + 15, img.width / 8, img.height / 8);
  image(img, 600, GROUND_Y + 15, img.width / 8, img.height / 8);

}

function timerSetter() {
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
    noLoop();
  }
}



// Sprite LOGIC
function gameLogic() {
  //boundaries for player 1
  if (SHEMAR.position.y >= 390) {
    SHEMAR.position.y = 390;
  }
  if (SHEMAR.position.x >= 790) {
    SHEMAR.position.x = 790;
  }
  if (SHEMAR.position.x <= 10) {
    SHEMAR.position.x = 10;
  }
  if (SHEMAR.position.y >= 390) {
    SHEMAR.velocity.x = 0
  }

  //limits player 1 jumping to 2 consecutive jumps
  if (SHEMAR.position.y >= 370) {
    jumpCount = 0
    jumpSwitch = true
  }

  //player 1 platform collisions
  if (SHEMAR.collide(platformSTATIC)) {
    jumpCount = -1;
    jumpSwitch = true;
    SHEMAR.velocity.y = GRAVITY * 2
  }

  if (SHEMAR.collide(platform1) || SHEMAR.collide(platform2)) {
    jumpCount = -1;
    jumpSwitch = true;
    if ((platformSwitch === false) || (platform2 === false)) {
      SHEMAR.velocity.x = -1.5
    } else
      SHEMAR.velocity.x = 1.5
  }

  //player 2 ship collisions
  if (SHIP.collide(platformSTATIC) || SHIP.collide(platform1) || SHIP.collide(platform2)) {
    text("SHEMAR WINS", width / 2, 20);
    noLoop();
  }
  if (SHIP.collide(SHEMAR)) {
    textSize(20);
    textAlign(CENTER, CENTER);
    text("SHIP WINS", width / 2, 20);
    noLoop();
  }

  //bullet collisions with player and platforms
  if (bullets.length != 0) {
    for (let b of bullets) {
      if (b.collide(SHEMAR)) {
        textSize(20);
        textAlign(CENTER, CENTER);
        text("SHIP WINS", width / 2, 20);
        noLoop();
      } else if (b.collide(platformSTATIC) || b.collide(platform1) || b.collide(platform2)) {
        b.remove()
      }
    }
  }

  // LOGIC TO NOT FALL THROUGH GROUND
  if (SHEMAR.position.y <= 330) {
    SHEMAR.velocity.y += GRAVITY;
  } else if (SHEMAR.position.y >= 390) {
    SHEMAR.velocity.y = 0
  }

  // PLATFORM 1 LOGIC
  if (platformSwitch === true) {
    if (platform1.position.x >= 850) {
      platformSwitch = false;
    } else {
      platform1.position.x += 1.5;
    }
  } else {
    if (platform1.position.x <= -80) {
      platformSwitch = true
    } else {
      platform1.position.x -= 1.5
    }
  }

  // PLATFORM 2 LOGIC
  if (platformSwitch2 === true) {
    if (platform2.position.x >= 1850) {
      platformSwitch2 = false;
    } else {
      platform2.position.x += 1.5;
    }
  } else {
    if (platform2.position.x <= -480) {
      platformSwitch2 = true
    } else {
      platform2.position.x -= 1.5
    }
  }
}

function mainMovements() {
  // PLAYER ONE CONTROLS
  if (keyIsDown(UP_ARROW) && jumpSwitch) {
    if (jumpCount >= 1) {
      jumpSwitch = false
    } else {
      SHEMAR.velocity.y = JUMP;

      jumpCount++

      let data = {
        x: SHEMAR.position.x,
        y: SHEMAR.position.y
      }
      socket.emit('jumpS1', data)
    }

  } else if (keyIsDown(DOWN_ARROW) && SHEMAR.position.x >= 570 && SHEMAR.position.x <= 650 && SHEMAR.position.y === 390) {

    SHEMAR.position.x = 200
    SHEMAR.position.y = 200

    let data = {
      x: SHEMAR.position.x,
      y: SHEMAR.position.y,
      vY: SHEMAR.velocity.y,
      vX: SHEMAR.velocity.x
    }
    socket.emit('portal', data)

    // PLAYER TWO CONTROLS
  } else if (keyIsDown(32)) {
    BULLET = createSprite(width / 4, height / 4, 2, 10);

    BULLET.velocity.y = 2;
    BULLET.velocity.x = random(-1, 1);
    BULLET.position.x = SHIP.position.x;
    BULLET.position.y = SHIP.position.y;
    bullets.push(BULLET)

    let data = {
      x: BULLET.position.x,
      y: BULLET.position.y,
      velocityY: BULLET.velocity.y,
      velocityX: BULLET.velocity.x
    }
    socket.emit('shoot', data)
  }

}