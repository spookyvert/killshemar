// helper methods and variables

platformSwitch = false;
platformSwitch2 = true;
const BASE_URL = "https://quiet-brushlands-57599.herokuapp.com/"
// const BASE_URL = "http://localhost:3000/"

function endGame(winningPlayer) {
  //Shemar score affected by invisibilityCount!
  playerOneScore = 60 - timer - (invisibilityCount * 5);
  //Ship score
  playerTwoScore = 0 + timer - lizardPenalty;

  if (winningPlayer === "ship") {

    if (document.querySelector('#ship') != null) {

      winningPlayerName = document.querySelector('#ship').value

      for (let li of document.querySelectorAll('li')) {

        if (li.dataset.name === winningPlayerName) {
          nameFound = true;
          let newHighScore;
          let win = Number(li.dataset.win) + 1
          if (li.dataset.score < playerTwoScore) {
            newHighScore = playerTwoScore
          } else {

            newHighScore = li.dataset.score
          }
          let configObj = {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({

              name: winningPlayerName,
              win: win,
              score: newHighScore
            }) //body
          } //configObj
          console.log(configObj)
          if (winningPlayer != undefined) {

            fetch(`${BASE_URL}api/v1/users/${li.dataset.id}`, configObj)
              .then(response => response.json())
              .then(json => {
                let liTag = document.getElementById(li.dataset.id)
                liTag.innerText = `<li data-id="${json.id}" data-name="${json.name}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${json.name}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
              </li>`
              })
          }
          //if score is less than new score
        } //if dataname is winningPlayerName
      } //for loop
    } //if querySelector
    if (document.querySelector('#ship') != null && nameFound === false) {
      let configObj = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: winningPlayerName,
          win: 1,
          score: playerTwoScore
        }) //body
      } //configObj

      if (winningPlayer != undefined) {
        fetch(`${BASE_URL}api/v1/users`, configObj)
          .then(response => response.json())
          .then(json => {

            ulTag.innerHTML += `<li data-id="${json.id}" data-name="${json.name}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${json.name}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
          </li>`

          })
      }
    }
  } //if ship end


  if (winningPlayer === "shemar") {

    if (document.querySelector('#shemar') != null) {
      winningPlayerName = document.querySelector('#shemar').value
    }
    for (let li of document.querySelectorAll('li')) {

      console.log(li.dataset.name)
      if (li.dataset.name === winningPlayerName) {
        nameFound = true;
        let newHighScore;
        let win = Number(li.dataset.win) + 1
        if (li.dataset.score < playerOneScore) {
          newHighScore = playerTwoScore
        } else {

          newHighScore = li.dataset.score
        }
        let configObj = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({

            name: winningPlayerName,
            win: win,
            score: newHighScore
          }) //body
        } //configObj
        console.log(configObj)
        if (winningPlayer != undefined) {
          fetch(`${BASE_URL}api/v1/users/${li.dataset.id}`, configObj)
            .then(response => response.json())
            .then(json => {
              console.log(json)
              let liTag = document.getElementById(li.dataset.id)
              console.log("yo")
              console.log(document.getElementById(li.dataset.id))

              liTag.innerText = `<li data-id="${json.id}" data-name="${json.name}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${json.name}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
            </li>`


              console.log(liTag)
            })
        }

        //if score is less than new score

      } //if dataname is winningPlayerName
    } //for loop
  } //if querySelector
  else if (document.querySelector('#shemar') != null && nameFound === false) {
    let configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: winningPlayerName,
        win: 1,
        score: playerOneScore
      }) //body
    } //configObj

    if (winningPlayer != undefined) {
      fetch(`${BASE_URL}api/v1/users`, configObj)
        .then(response => response.json())
        .then(json => {

          ulTag.innerHTML += `<li data-id="${json.id}" data-name="${input.value()}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${input.value()}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
        </li>`

        })
    }

  }

} //function end

function randomDirection() {
  return (Math.floor(Math.random() * 2) == 0) ? platformX = 20 : platformX = 800
}

function groundLayout() {
  return (
    image(img, 0, GROUND_Y + 15, img.width / 4, img.height / 4),
    image(img, 400, GROUND_Y + 15, img.width / 4, img.height / 4),
    image(img, 800, GROUND_Y + 15, img.width / 4, img.height / 4),
    image(img, 1000, GROUND_Y + 15, img.width / 4, img.height / 4),
    image(img, 1450, GROUND_Y + 15, img.width / 4, img.height / 4),
    image(img, 1600, GROUND_Y + 15, img.width / 4, img.height / 4)


  )
}

//timer setting along with invisibilityCount adjustments
function timerSetter() {
  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }
  if (timer != 0) {
    fill(251, 214, 42)
    textFont(gameFont)
    textAlign(RIGHT);
    textSize(18);
    text(timer + "s", width - 30, 40)



  }
  if (timer <= 0) {
    textSize(20);
    textAlign(CENTER, CENTER);

    winner = "shemar"
    endGame(winner);
    if (input.id() == winner) {
      textFont(gameFont);
      text(`${input.value().toUpperCase()} WINS`, width / 2, 20)
    }

    console.log(winningPlayerName)
    noLoop();
    location.reload(true);
  }
  if ((timerAdjustInvisible === true && invisibilityCount === 1) || (timerAdjustInvisible === true && invisibilityCount === 2) || (timerAdjustInvisible === true && invisibilityCount === 3)) {
    timer++
    timerAdjustInvisible = false
  }

}

// Sprite LOGIC
function gameLogic() {
  //boundaries for player 1
  if (SHEMAR.position.y >= 690) {
    SHEMAR.position.y = 690;
  }
  if (SHEMAR.position.x >= 1920) {
    SHEMAR.position.x = 1920;
  }
  if (SHEMAR.position.x <= 10) {
    SHEMAR.position.x = 10;
  }
  if (SHEMAR.position.y <= 0) {
    SHEMAR.position.y = 0
  }

  //limits player 1 jumping to 2 consecutive jumps
  if (SHEMAR.position.y >= 690) {
    jumpCount = 0
    jumpSwitch = true
  }

  //player 1 platform collisions
  if (SHEMAR.collide(platformSTATIC)) {
    jumpCount = 0;
    jumpSwitch = true;
    SHEMAR.velocity.y = GRAVITY * 2
  }

  if (SHEMAR.collide(platform1) || SHEMAR.collide(platform2)) {
    jumpCount = 0;
    jumpSwitch = true;
    if ((platformSwitch === false)) {
      SHEMAR.velocity.x = -1.5
    } else {
      SHEMAR.velocity.x = 1.5
    }
  }

  //player 2 ship collisions
  if (SHIP.collide(platformSTATIC) || SHIP.collide(platform1) || SHIP.collide(platform2)) {
    winner = "shemar"

    endGame(winner);
    if (input.id() == winner) {
      textFont(gameFont);
      text(`${input.value().toUpperCase()} WINS`, width / 2, 20)
    }
    noLoop();
    location.reload(true);

  }
  if (SHIP.collide(SHEMAR)) {
    textSize(20);
    textAlign(CENTER, CENTER);

    winner = "ship"

    endGame(winner);
    if (input.id() == winner) {
      textFont(gameFont);
      text(`${input.value().toUpperCase()} WINS`, width / 2, 20)
    }
    console.log(winningPlayerName)
    noLoop();
    location.reload(true);

  }

  //bullet collisions with player and platforms
  if (bullets.length != 0 && alpha > 127) {
    for (let b of bullets) {
      if (b.collide(SHEMAR)) {
        textSize(20);
        textAlign(CENTER, CENTER);
        winner = "ship"

        endGame(winner);
        if (input.id() == winner) {
          textFont(gameFont);
          text(`${input.value().toUpperCase()} WINS`, width / 2, 20)
        }


        noLoop();
        location.reload(true);

      } else if (b.collide(platformSTATIC) || b.collide(platform1) || b.collide(platform2)) {
        b.remove()
      }
    }
  }

  // LOGIC TO NOT FALL THROUGH GROUND
  if (SHEMAR.position.y <= 690) {
    SHEMAR.velocity.y += GRAVITY;
    SHEMAR.velocity.x = 0
  } else if (SHEMAR.position.y >= 690) {
    SHEMAR.velocity.y = 0
    SHEMAR.velocity.x = 0

  }

  //Lizard logic
  if (LIZARD != undefined && LIZARD.position.y >= 700) {
    LIZARD.position.y = 700;
  }
  if (LIZARD != undefined && alpha > 127) {
    if (SHEMAR.collide(LIZARD)) {
      textSize(20);
      textAlign(CENTER, CENTER);
      winner = "ship"

      endGame(winner);
      if (input.id() == winner) {
        textFont(gameFont);
        text(`${input.value().toUpperCase()} WINS`, width / 2, 20)
      }
      console.log(winningPlayerName)
      noLoop();
      location.reload(true);

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

}

function mainMovements() {

  // PLAYER ONE CONTROLS
  if (keyIsDown(UP_ARROW) && jumpSwitch && team == 'shemar') {
    SHEMAR.addImage(jumpImg)

    if (jumpCount >= 2) {
      jumpSwitch = false
    } else {
      SHEMAR.velocity.y = JUMP;

      jumpCount++

      let data = {
        Vy: SHEMAR.velocity.y
      }

      socket.emit('jumpS1', data)
    }

  } else if (keyIsDown(DOWN_ARROW) && SHEMAR.position.x >= 860 && SHEMAR.position.x <= 930 && SHEMAR.position.y === 690 && team == 'shemar') {

    SHEMAR.position.x = 275
    SHEMAR.position.y = 220

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
    BULLET = createSprite(width / 2, height / 2, 2, 10);
    BULLET.addImage(bulletImg)
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
    LIZARD.addImage(lizardImg, width / 2, height / 2)
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