// helper methods and variables

platformSwitch = false;
platformSwitch2 = true;

function endGame() {
  //Shemar score affected by invisibilityCount!
  playerOneScore = 60 - timer - (invisibilityCount * 5);
  //Ship score
  playerTwoScore = 0 + timer - lizardPenalty;
}

function randomDirection() {
  return (Math.floor(Math.random() * 2) == 0) ? platformX = 20 : platformX = 800
}

function groundLayout() {
  return (
    image(img, 0, GROUND_Y + 15, img.width / 8, img.height / 8),
    image(img, 220, GROUND_Y + 15, img.width / 8, img.height / 8),
    image(img, 450, GROUND_Y + 15, img.width / 8, img.height / 8),
    image(img, 600, GROUND_Y + 15, img.width / 8, img.height / 8)
  )
}

//timer setting along with invisibilityCount adjustments
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
    endGame();
    noLoop();
  }
  if ((timerAdjustInvisible === true && invisibilityCount === 1) || (timerAdjustInvisible === true && invisibilityCount === 2) || (timerAdjustInvisible === true && invisibilityCount === 3)) {
    timer++
    timerAdjustInvisible = false
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
    } else {
      SHEMAR.velocity.x = 1.5
    }
  }

  //player 2 ship collisions
  if (SHIP.collide(platformSTATIC) || SHIP.collide(platform1) || SHIP.collide(platform2)) {
    text("SHEMAR WINS", width / 2, 20);
    endGame();
    noLoop();
  }
  if (SHIP.collide(SHEMAR)) {
    textSize(20);
    textAlign(CENTER, CENTER);
    text("SHIP WINS", width / 2, 20);
    endGame();
    noLoop();
  }

  //bullet collisions with player and platforms
  if (bullets.length != 0 && alpha > 127) {
    for (let b of bullets) {
      if (b.collide(SHEMAR)) {
        textSize(20);
        textAlign(CENTER, CENTER);
        text("SHIP WINS", width / 2, 20);
        endGame();
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

  //Lizard logic
  if (LIZARD != undefined && LIZARD.position.y >= 390) {
    LIZARD.position.y = 390;
  }
  if (LIZARD != undefined && alpha > 127) {
    if (SHEMAR.collide(LIZARD)) {
      textSize(20);
      textAlign(CENTER, CENTER);
      text("SHIP WINS", width / 2, 20);
      endGame();
      noLoop();
    }
    if (bullets.length != 0) {
      for (let b of bullets) {
        if (b.collide(LIZARD)) {
          b.remove()
          LIZARD.remove()
          lizardCount = 0;
        }
      }
    }
  }

  //space lizards
  if (LIZARD != undefined) {
    if (SHEMAR.position.x >= LIZARD.position.x) {
      LIZARD.velocity.x = 0.75
    } else if (SHEMAR.position.x < LIZARD.position.x) {
      LIZARD.velocity.x = -0.75
    }
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


function mainMovementsDraw() {
  // PLAYER 1
  if (mouseIsPressed && team == 'ship') {
    getAudioContext().resume()
    // THIS SENDS IT TO THE SERVER, OTHER SERVER
    let data = {
      x: mouseX,
      y: mouseY
    }
    socket.emit('mouse', data)

    SHIP.attractionPoint(70, mouseX, mouseY);
  }

  // PLAYER 2
  if (keyIsDown(RIGHT_ARROW) && SHEMAR.position.x < 790 && team == 'shemar') {
    SHEMAR.position.x += 10;
  } else if (keyIsDown(LEFT_ARROW) && SHEMAR.position.x > 10 && team == 'shemar') {
    SHEMAR.position.x -= 10;
  }

  let data2 = {
    x: SHEMAR.position.x
  }
  socket.emit('linearS1', data2)
}

function mainMovements() {

  // PLAYER ONE CONTROLS
  if (keyIsDown(UP_ARROW) && jumpSwitch && team == 'shemar') {
    if (jumpCount >= 1) {
      jumpSwitch = false
    } else {
      SHEMAR.velocity.y = JUMP;

      jumpCount++

      let data = {
        Vy: SHEMAR.velocity.y
      }

      socket.emit('jumpS1', data)
    }

  } else if (keyIsDown(DOWN_ARROW) && SHEMAR.position.x >= 570 && SHEMAR.position.x <= 650 && SHEMAR.position.y === 390 && team == 'shemar') {

    SHEMAR.position.x = 200
    SHEMAR.position.y = 200

    let data = {
      x: SHEMAR.position.x,
      y: SHEMAR.position.y,
      vY: SHEMAR.velocity.y,
      vX: SHEMAR.velocity.x
    }
    socket.emit('portal', data)

    // invisibility trigger
  } else if (keyIsDown(16) && invisibilityCount < 3 && team == 'shemar') {
    invisible = true
    alpha = 0
    invisibilityCount += 1
    timerAdjustInvisible = true

    let data = {
      invis: invisible,
      alpha: alpha,
      iC: invisibilityCount,
      tAI: timerAdjustInvisible
    }
    socket.emit('invisible', data)

    // PLAYER TWO CONTROLS
  } else if (keyIsDown(32) && team == 'ship') {
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
    //space lizards
  } else if (keyIsDown(90) && lizardCount === 0 && team == 'ship') {

    LIZARD = createSprite(400, 0, 20, 20)
    LIZARD.velocity.y = 2;
    lizardCount++;
    lizardPenalty += 5;
    timer--;

    let data = {
      yV: LIZARD.velocity.y
    }
    socket.emit('lizard', data)
  }
}

// wave
function wave() {
  bgWave = fill(19, 19, 19);
  bgWave
  noStroke();
  // We are going to draw a polygon out of the wave points
  beginShape();

  let xoff = 0; // Option #1: 2D Noise
  // let xoff = yoff; // Option #2: 1D Noise

  // Iterate over horizontal pixels
  for (let x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise, map to

    // Option #1: 2D Noise
    let y = map(noise(xoff, yoff), 0, 1, 200, 300);

    // Option #2: 1D Noise
    // let y = map(noise(xoff), 0, 1, 200,300);

    // Set the vertex
    vertex(x, y);
    // Increment x dimension for noise
    xoff += 0.05;
  }
  // increment y dimension for noise
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

//rain

function droplets(xpos, ypos, size, rainColor) {
  noStroke();
  fill(255, 255, 255, rainColor);
  ellipse(xpos, ypos, size / 6, size);
}


function rain(x, y) {
  fill(255, 255, 255);
  noStroke();

}

function rainRun() {
  let ran = random(10);

  vol = mic.getLevel() * 100;

  // console.log(vol);

  bgWave = fill((vol * 0.5) + 19, (vol * 0.5) + 19, 19);
  let newDroplets = {
    xpos: random(0, window.width),
    ypos: 0,
    size: vol,
    rainColor: random(100, 255)
  };
  rainA.push(newDroplets);

  for (i = 0; i < rainA.length; i++) {
    var currentObj = rainA[i];
    droplets(currentObj.xpos, currentObj.ypos, currentObj.size, currentObj.rainColor);
    currentObj.ypos += vol + random(2, 10);
    if (rainA[i].ypos > height + 20) {
      rainA.splice(i, 1);
    }
  }

  rain(0, 100, 100);

}