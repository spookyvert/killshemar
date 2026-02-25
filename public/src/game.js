// Core game variables
let SHEMAR;
let SHIP;
let BULLET;
let LIZARD;
let PORTAL;
let ROCK;

let ulTag = document.querySelector('#list');
let nameFound = false;

let playerOneScore = 0;
let playerTwoScore = 0;
let winningPlayerName;
let winningPlayer;

let lizardCount = 0;
let lizardPenalty = 0;
let timerAdjustLizard = 0;

let GRAVITY = 0.8;
let GROUND_Y = 670;
let JUMP = -20;

let img;
let bg;
let bgTop;
let bgTopOffset1 = 0;
let bgTopOffset2 = 0;
let bgTopSpeed = 0.5;
let bgTopImgWidth;

let platform1;
let platform2;
let platformSTATIC;
let rocketImg;
let lizardImg;
let portalImg;
let rockImg;
let cloudImg;
let bulletImg;
let fameImg;
let jumpImg;
let spritesheet1;
let spritesheet2;
let spritedata1;
let spritedata2;
let animationLeft = [];
let animationRight = [];
let count = 0;
let lastShemarFacing = 'left';

let gameFont;
let gameStarted = false;
let team;

let jumpSwitch = true;
let jumpCount = 0;
let timer = 60;
let bullets = [];
let rainA = [];
let yoff = 0.0;

let platformSwitch = false;
let platformSwitch2 = true;
let platformX = 0;
let lastPhase = null;

let titleLogo;
let readyButton;
let touchControls;

let mic;
let invisible = false;
let alpha = 255;
let invisibilityCount = 0;
let timerAdjustInvisible = false;

const playerOne = {
  x: 400,
  y: 650,
  w: 20,
  h: 20
};

const playerTwo = {
  x: 400,
  y: 100,
  w: 20,
  h: 20
};

const portal = {
  x: 900,
  y: 670,
  w: 75,
  h: 25
};

class Platform {
  sprite() {
    const yMin = 320;
    const yMax = 350;
    const rY = Math.floor(Math.random() * (+yMax - +yMin)) + +yMin;

    const wMin = 35;
    const wMax = 65;
    const rW = Math.floor(Math.random() * (+wMax - +wMin)) + +wMin;

    return {
      y: rY,
      w: rW
    };
  }
}

window.GameActions = {
  setTeam(role) {
    team = role;
  },
  setGameStarted(start) {
    gameStarted = start;
  },
  updateShemarX(data) {
    if (SHEMAR) {
      SHEMAR.position.x = data.x;
      if (typeof data.frame === 'number') {
        count = data.frame;
      }
      if (data.facing === 'right' || data.facing === 'left') {
        lastShemarFacing = data.facing;
      }
    }
  },
  applyShipTarget(data) {
    if (SHIP) {
      if (data && data.mode === 'follow') {
        SHIP.position.x = data.x;
        SHIP.position.y = data.y;
      } else {
        SHIP.attractionPoint(70, data.x, data.y);
      }
    }
  },
  spawnBullet(data) {
    if (!bulletImg) return;
    BULLET = createSprite(width / 4, height / 4, 2, 10);
    BULLET.addImage(bulletImg);
    BULLET.velocity.y = data.velocityY;
    BULLET.velocity.x = data.velocityX;
    BULLET.position.x = data.x;
    BULLET.position.y = data.y;
    bullets.push(BULLET);
  },
  updatePlatform1(data) {
    if (!platform1) return;
    platform1.position.x = data.x;
    platform1.position.w = data.y;
    platform1.width = data.w;
    platform1.shapeColor = color(0, 255, 0);
  },
  updatePlatform2(data) {
    if (!platform2) return;
    platform2.position.x = data.x;
    platform2.position.w = data.y;
    platform2.width = data.w;
    platform2.shapeColor = color(255, 0, 0);
  },
  applyInvisibility() {
    if (SHEMAR) {
      SHEMAR.hide();
    }
  },
  spawnLizard(data) {
    if (!lizardImg) return;
    LIZARD = createSprite(400, 0, 20, 20);
    LIZARD.addImage(lizardImg, width, height);
    LIZARD.velocity.y = data.yV;
  },
  applyJump(data) {
    if (SHEMAR) {
      SHEMAR.velocity.y = data.Vy;
    }
  },
  applyPortal(data) {
    if (!SHEMAR) return;
    SHEMAR.position.y = data.y;
    SHEMAR.position.x = data.x;
    SHEMAR.velocity.x = data.vX;
    SHEMAR.velocity.y = data.vY;
  },
  refreshUI() {
    if (typeof positionUIElements === 'function') {
      positionUIElements();
    }
  }
};

window.preload = function preload() {
  const assets = window.GameConstants.ASSETS;
  gameFont = loadFont(assets.fonts.pressStart);
  spritedata1 = loadJSON(assets.shemar.leftJson);
  spritesheet1 = loadImage(assets.shemar.leftPng);
  spritedata2 = loadJSON(assets.shemar.rightJson);
  spritesheet2 = loadImage(assets.shemar.rightPng);
  jumpImg = loadImage(assets.shemar.jumpPng);

  img = loadImage(assets.images.grass);
  fameImg = loadImage(assets.images.fame);
  bulletImg = loadImage(assets.images.bullet);
  rocketImg = loadImage(assets.images.rocket);
  lizardImg = loadImage(assets.images.lizard);
  portalImg = loadImage(assets.images.portal);
  rockImg = loadImage(assets.images.rock);
  cloudImg = loadImage(assets.images.cloud);
  bg = loadImage(assets.images.background);
  bgTop = loadImage(assets.images.topbg);
};

window.setup = function setup() {
  if (window.Network && !window.Network.socket) {
    window.Network.init();
  }
  createCanvas(windowWidth, windowHeight);
  const cnv = document.querySelector('canvas');
  if (cnv) {
    cnv.style.position = 'fixed';
    cnv.style.top = '0';
    cnv.style.left = '0';
    cnv.style.width = '100vw';
    cnv.style.height = '100vh';
    cnv.style.zIndex = '1';
    cnv.style.display = 'block';
  }

  mic = new p5.AudioIn();
  mic.start();

  gameStarted = false;

  PORTAL = createSprite(portal.x, portal.y, portal.w, portal.h);
  PORTAL.addImage(portalImg);

  ROCK = createSprite(portal.x + 890, portal.y + 30, portal.w, portal.h);
  ROCK.addImage(rockImg);

  SHEMAR = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);

  const leftFrames = spritedata1.frames;
  const rightFrames = spritedata2.frames;

  for (const frame in leftFrames) {
    const pos = leftFrames[frame].position;
    const imgFrame = spritesheet1.get(pos.x, pos.y, pos.w, pos.h);
    animationLeft.push(imgFrame);
  }

  for (const frame in rightFrames) {
    const pos = rightFrames[frame].position;
    const imgFrame = spritesheet2.get(pos.x, pos.y, pos.w, pos.h);
    animationRight.push(imgFrame);
  }

  SHEMAR.velocity.y = 0;

  SHIP = createSprite(playerTwo.x, playerTwo.y, playerTwo.w, playerTwo.h);
  SHIP.addImage(rocketImg);
  SHIP.shapeColor = color(255);
  SHIP.rotateToDirection = true;
  SHIP.maxSpeed = 2;
  SHIP.friction = 0.99;

  const tmp = new Platform();
  const tmp2 = new Platform();

  const p = tmp.sprite();
  const q = tmp2.sprite();

  randomDirection();
  platform1 = createSprite(platformX, p.y + random(100, 150), p.w, 20);
  platform1.addImage(cloudImg);

  const p1Data = {
    x: platformX,
    y: p.y,
    w: p.w
  };
  window.Network.emitPlatform1(p1Data);

  platform2 = createSprite(platformX, p.y + random(150, 200), p.w, 20);
  platform2.addImage(cloudImg);

  const plaformData2 = {
    x: platformX,
    y: p.y - 50,
    w: p.w
  };
  window.Network.emitPlatform2(plaformData2);

  platformSTATIC = createSprite(276, 355, 60, 20);
  platformSTATIC.addImage(cloudImg);

  titleLogo = createElement('p', '🔪 Kill 🔪<br><br> Shemar').addClass('title');
  readyButton = createButton('Ready').addClass('eightbit-btn eightbit-btn--reset');
  readyButton.attribute('id', 'ready-button');
  readyButton.mousePressed(() => {
    if (window.Network && window.Network.emitReady) {
      window.Network.emitReady();
      if (window.UI && window.UI.setSessionStatus) {
        window.UI.setSessionStatus('Ready sent...');
      }
      readyButton.html('Ready!');
      readyButton.attribute('disabled', true);
    }
  });

  createTouchControls();
  positionUIElements();

  bgTopImgWidth = bgTop.width;
};

window.draw = function draw() {
  const currentPhase = window.GameState.getPhase();
  if (currentPhase !== lastPhase) {
    positionUIElements();
    lastPhase = currentPhase;
  }
  if (windowWidth < 700) {
    image(bg, 0, 0, windowWidth, windowHeight);
  } else {
    const bgTileWidth = bg.width;
    const bgTileHeight = bg.height;
    const tilesX = Math.ceil(windowWidth / bgTileWidth) + 1;
    const tilesY = Math.ceil(windowHeight / bgTileHeight) + 1;
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        image(bg, x * bgTileWidth, y * bgTileHeight, bgTileWidth, bgTileHeight);
      }
    }
  }

  fill(255);
  noStroke();

  if (lastShemarFacing === 'right') {
    SHEMAR.addImage(animationRight[count]);
  } else {
    SHEMAR.addImage(animationLeft[count]);
  }
  rainRun();

  const bgTopHeight = Math.ceil(windowHeight * 0.28);
  let scaleFactor = 1;
  if (windowWidth < 700) {
    scaleFactor = 1.7;
  }
  const bgTopDrawHeight = bgTop.height * scaleFactor;
  const bgTopY = windowHeight - bgTopDrawHeight;

  bgTopOffset1 -= bgTopSpeed;
  bgTopOffset2 += bgTopSpeed;
  if (bgTopOffset1 <= -bgTopImgWidth) bgTopOffset1 = bgTopImgWidth;
  if (bgTopOffset2 >= bgTopImgWidth) bgTopOffset2 = -bgTopImgWidth;

  image(bgTop, bgTopOffset1, bgTopY, bgTopImgWidth, bgTopDrawHeight);
  image(bgTop, bgTopOffset2, bgTopY, bgTopImgWidth, bgTopDrawHeight);

  groundLayout();

  if (window.GameState.isMatch()) {
    gameStarted = true;
    const menuBtn = document.querySelector('.sidebar-btn');
    if (menuBtn) {
      menuBtn.style.display = 'block';
    }

    if (invisible === true) {
      SHEMAR.shapeColor = color(255, 0, 0, alpha);
      if (alpha < 255) {
        alpha += 0.5;
      } else if (alpha === 255) {
        invisible = false;
      }
    }

    handleShemarMovement();
    handleShipMovement();

    timerSetter();
    gameLogic();
    drawSprites();
    mainMovementsDraw();
  } else {
    gameStarted = false;
  }
};

window.keyPressed = function keyPressed() {
  mainMovements();
};

function handleShemarMovement() {
  if (window.Input.right() && SHEMAR.position.x < windowWidth - 260 && team === 'shemar') {
    SHEMAR.addImage(animationRight[count]);
    SHEMAR.position.x += 10;
    lastShemarFacing = 'right';
    stepAnimation();
  } else if (window.Input.left() && SHEMAR.position.x > 10 && team === 'shemar') {
    SHEMAR.addImage(animationLeft[count]);
    SHEMAR.position.x -= 10;
    lastShemarFacing = 'left';
    stepAnimation();
  }

  const data2 = {
    x: SHEMAR.position.x,
    frame: count,
    facing: lastShemarFacing
  };
  window.Network.emitShemarX(data2);
}

function handleShipMovement() {
  if (team !== 'ship') {
    return;
  }

  if (!SHEMAR) {
    return;
  }

  const targetX = SHEMAR.position.x;
  const targetY = SHEMAR.position.y + (SHIP.height / 2);
  SHIP.position.x = constrain(targetX, 0, windowWidth);
  SHIP.position.y = constrain(targetY, 0, windowHeight);

  window.Network.emitShipTarget({
    x: SHIP.position.x,
    y: SHIP.position.y,
    mode: 'follow'
  });
}

function stepAnimation() {
  let tmpCount = count;
  tmpCount++;
  if (tmpCount >= 3) {
    tmpCount = 0;
  }
  count = tmpCount;
}

function positionUIElements() {
  let flexContainer = document.getElementById('ui-flex-container');
  if (!flexContainer) {
    flexContainer = document.createElement('div');
    flexContainer.id = 'ui-flex-container';
    document.body.appendChild(flexContainer);
  }
  Object.assign(flexContainer.style, {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
    background: 'none'
  });

  function moveToFlex(el) {
    if (el && el.elt && el.elt.parentNode !== flexContainer) {
      flexContainer.appendChild(el.elt);
    }
    if (el && el.style) {
      if (el.hasClass && el.hasClass('title')) {
        el.style('position', 'fixed');
        el.style('top', '8vh');
        el.style('left', '0');
        el.style('right', '0');
        el.style('margin', '0 auto');
        el.style('z-index', '20');
        el.style('display', 'block');
        el.style('pointer-events', 'none');
      } else {
        el.style('position', 'static');
        el.style('margin', '16px 0');
        el.style('pointer-events', 'auto');
      }
    }
  }

  function animateShow(el) {
    if (el && el.elt) {
      el.elt.classList.remove('show');
      void el.elt.offsetWidth;
      el.elt.classList.add('show');
    }
  }

  moveToFlex(titleLogo);
  moveToFlex(readyButton);

  if (window.GameState.isMatch()) {
    flexContainer.style.display = 'none';
  } else {
    flexContainer.style.display = 'flex';
  }
  if (titleLogo && titleLogo.elt) {
    titleLogo.show();
    animateShow(titleLogo);
  }
  updateReadyButton();
  updateTouchControls();
}

function updateReadyButton() {
  if (!readyButton) {
    return;
  }
  const phase = window.GameState.getPhase();
  const session = window.GameState.getSessionStatus();
  const localTeam = window.GameState.getTeam();
  const isReady = (localTeam === 'shemar' && session.hostReady) || (localTeam === 'ship' && session.guestReady);
  const bothPresent = session.hostPresent && session.guestPresent;
  if (phase === window.GameConstants.STATES.LOBBY && (session.locked || bothPresent)) {
    readyButton.show();
    if (isReady) {
      readyButton.attribute('disabled', true);
      readyButton.html('Ready!');
    } else {
      readyButton.attribute('disabled', false);
      readyButton.html('Ready');
    }
  } else {
    readyButton.hide();
  }
}

function createTouchControls() {
  if (touchControls) {
    return;
  }
  const wrapper = document.createElement('div');
  wrapper.id = 'touch-controls';
  wrapper.className = 'touch-controls';

  const dpad = document.createElement('div');
  dpad.className = 'dpad';

  const up = document.createElement('button');
  up.className = 'touch-btn';
  up.dataset.dir = 'up';
  up.textContent = '▲';

  const left = document.createElement('button');
  left.className = 'touch-btn';
  left.dataset.dir = 'left';
  left.textContent = '◀';

  const right = document.createElement('button');
  right.className = 'touch-btn';
  right.dataset.dir = 'right';
  right.textContent = '▶';

  const down = document.createElement('button');
  down.className = 'touch-btn';
  down.dataset.dir = 'down';
  down.textContent = '▼';

  dpad.appendChild(up);
  dpad.appendChild(left);
  dpad.appendChild(right);
  dpad.appendChild(down);
  wrapper.appendChild(dpad);
  document.body.appendChild(wrapper);

  const activate = (event) => {
    event.preventDefault();
    const dir = event.currentTarget.dataset.dir;
    window.Input.setTouch(dir, true);
  };

  const deactivate = (event) => {
    event.preventDefault();
    const dir = event.currentTarget.dataset.dir;
    window.Input.setTouch(dir, false);
  };

  for (const btn of [up, down, left, right]) {
    btn.addEventListener('pointerdown', activate);
    btn.addEventListener('pointerup', deactivate);
    btn.addEventListener('pointerleave', deactivate);
    btn.addEventListener('pointercancel', deactivate);
    btn.addEventListener('touchstart', activate, { passive: false });
    btn.addEventListener('touchend', deactivate, { passive: false });
  }

  touchControls = wrapper;
}

function updateTouchControls() {
  if (!touchControls) {
    return;
  }
  if (window.GameState.isMatch()) {
    touchControls.style.display = 'flex';
  } else {
    touchControls.style.display = 'none';
    if (window.Input && window.Input.clearTouch) {
      window.Input.clearTouch();
    }
  }
}

window.windowResized = function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  const cnv = document.querySelector('canvas');
  if (cnv) {
    cnv.style.width = '100vw';
    cnv.style.height = '100vh';
  }
  positionUIElements();
};

function groundLayout() {
  const groundHeight = Math.ceil(windowHeight * 0.16);
  const aspect = img.width / img.height;
  const targetWidth = windowWidth;
  const targetHeight = groundHeight;

  let drawWidth = targetWidth;
  let drawHeight = drawWidth / aspect;

  if (drawHeight < targetHeight) {
    drawHeight = targetHeight;
    drawWidth = drawHeight * aspect;
  }

  const x = (windowWidth - drawWidth) / 2;
  const y = windowHeight - drawHeight;

  image(img, x, y, drawWidth, drawHeight);
  noStroke();
  fill(0);
  rect(0, windowHeight, windowWidth, 100);
}

function timerSetter() {
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }
  if (timer !== 0) {
    fill(251, 214, 42);
    textFont(gameFont);
    textAlign(RIGHT);
    textSize(18);
    text(timer + 's', width - 30, 40);
  }
  if (timer <= 0) {
    textSize(20);
    textAlign(CENTER, CENTER);
    winningPlayer = 'shemar';
    endGame(winningPlayer);
    if (window.GameState.getTeam() === winningPlayer) {
      textFont(gameFont);
      const localName = (window.GameState.getPlayerName() || winningPlayer).toUpperCase();
      text(`${localName} WINS`, width / 2, 20);
    }
    noLoop();
    location.reload(true);
  }
  if (
    (timerAdjustInvisible === true && invisibilityCount === 1) ||
    (timerAdjustInvisible === true && invisibilityCount === 2) ||
    (timerAdjustInvisible === true && invisibilityCount === 3)
  ) {
    timer++;
    timerAdjustInvisible = false;
  }
}

function gameLogic() {
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
    SHEMAR.position.y = 0;
  }

  if (SHEMAR.position.y >= 690) {
    jumpCount = 0;
    jumpSwitch = true;
  }

  if (SHEMAR.collide(platformSTATIC)) {
    jumpCount = 0;
    jumpSwitch = true;
    SHEMAR.velocity.y = GRAVITY * 2;
  }

  if (SHEMAR.collide(platform1) || SHEMAR.collide(platform2)) {
    jumpCount = 0;
    jumpSwitch = true;
    if (platformSwitch === false) {
      SHEMAR.velocity.x = -1.5;
    } else {
      SHEMAR.velocity.x = 1.5;
    }
  }

  // Portal teleport: move Shemar to a cloud when touching portal
  if (PORTAL && SHEMAR.collide(PORTAL)) {
    const targetCloud = Math.random() < 0.5 ? platform1 : platform2;
    if (targetCloud) {
      SHEMAR.position.x = targetCloud.position.x;
      SHEMAR.position.y = targetCloud.position.y - 40;
      SHEMAR.velocity.x = 0;
      SHEMAR.velocity.y = 0;
      window.Network.emitPortal({
        x: SHEMAR.position.x,
        y: SHEMAR.position.y,
        vX: SHEMAR.velocity.x,
        vY: SHEMAR.velocity.y
      });
    }
  }

  if (SHIP.collide(platformSTATIC) || SHIP.collide(platform1) || SHIP.collide(platform2)) {
    winningPlayer = 'shemar';
    endGame(winningPlayer);
    if (window.GameState.getTeam() === winningPlayer) {
      textFont(gameFont);
      const localName = (window.GameState.getPlayerName() || winningPlayer).toUpperCase();
      text(`${localName} WINS`, width / 2, 20);
    }
    noLoop();
    location.reload(true);
  }
  if (SHIP.collide(SHEMAR)) {
    textSize(20);
    textAlign(CENTER, CENTER);
    winningPlayer = 'ship';
    endGame(winningPlayer);
    if (window.GameState.getTeam() === winningPlayer) {
      textFont(gameFont);
      const localName = (window.GameState.getPlayerName() || winningPlayer).toUpperCase();
      text(`${localName} WINS`, width / 2, 20);
    }
    noLoop();
    location.reload(true);
  }

  if (bullets.length !== 0 && alpha > 127) {
    for (const b of bullets) {
      if (b.collide(SHEMAR)) {
        textSize(20);
        textAlign(CENTER, CENTER);
        winningPlayer = 'ship';
        endGame(winningPlayer);
        if (window.GameState.getTeam() === winningPlayer) {
          textFont(gameFont);
          const localName = (window.GameState.getPlayerName() || winningPlayer).toUpperCase();
          text(`${localName} WINS`, width / 2, 20);
        }
        noLoop();
        location.reload(true);
      } else if (b.collide(platformSTATIC) || b.collide(platform1) || b.collide(platform2)) {
        b.remove();
      }
    }
  }

  if (SHEMAR.position.y <= 690) {
    SHEMAR.velocity.y += GRAVITY;
    SHEMAR.velocity.x = 0;
  } else if (SHEMAR.position.y >= 690) {
    SHEMAR.velocity.y = 0;
    SHEMAR.velocity.x = 0;
  }

  if (LIZARD !== undefined && LIZARD.position.y >= 700) {
    LIZARD.position.y = 700;
  }
  if (LIZARD !== undefined && alpha > 127) {
    if (SHEMAR.collide(LIZARD)) {
      textSize(20);
      textAlign(CENTER, CENTER);
      winningPlayer = 'ship';
      endGame(winningPlayer);
      if (window.GameState.getTeam() === winningPlayer) {
        textFont(gameFont);
        const localName = (window.GameState.getPlayerName() || winningPlayer).toUpperCase();
        text(`${localName} WINS`, width / 2, 20);
      }
      noLoop();
      location.reload(true);
    }
    if (bullets.length !== 0) {
      for (const b of bullets) {
        if (b.collide(LIZARD)) {
          b.remove();
          LIZARD.remove();
          lizardCount = 0;
        }
      }
    }
  }

  if (LIZARD !== undefined) {
    if (SHEMAR.position.x >= LIZARD.position.x) {
      LIZARD.velocity.x = 0.75;
    } else if (SHEMAR.position.x < LIZARD.position.x) {
      LIZARD.velocity.x = -0.75;
    }
  }

  if (platformSwitch === true) {
    if (platform1.position.x >= 850) {
      platformSwitch = false;
    } else {
      platform1.position.x += 1.5;
    }
  } else {
    if (platform1.position.x <= -80) {
      platformSwitch = true;
    } else {
      platform1.position.x -= 1.5;
    }
  }

  if (platformSwitch2 === true) {
    if (platform2.position.x >= 1850) {
      platformSwitch2 = false;
    } else {
      platform2.position.x += 1.5;
    }
  } else {
    if (platform2.position.x <= -480) {
      platformSwitch2 = true;
    } else {
      platform2.position.x -= 1.5;
    }
  }
}

function mainMovementsDraw() {
  if (mouseIsPressed && team === 'ship') {
    getAudioContext().resume();
    const data = {
      x: mouseX,
      y: mouseY
    };
    window.Network.emitShipTarget(data);
    SHIP.attractionPoint(70, mouseX, mouseY);
  }
}

function mainMovements() {
  if (keyIsDown(UP_ARROW) && jumpSwitch && team === 'shemar') {
    SHEMAR.addImage(jumpImg);
    if (jumpCount >= 2) {
      jumpSwitch = false;
    } else {
      SHEMAR.velocity.y = JUMP;
      jumpCount++;
      const data = {
        Vy: SHEMAR.velocity.y
      };
      window.Network.emitJump(data);
    }
  } else if (
    keyIsDown(DOWN_ARROW) &&
    SHEMAR.position.x >= 860 &&
    SHEMAR.position.x <= 930 &&
    SHEMAR.position.y >= 680 &&
    team === 'shemar'
  ) {
    SHEMAR.position.x = 275;
    SHEMAR.position.y = 220;
    const data = {
      x: SHEMAR.position.x,
      y: SHEMAR.position.y,
      vY: SHEMAR.velocity.y,
      vX: SHEMAR.velocity.x
    };
    window.Network.emitPortal(data);
  } else if (keyIsDown(16) && invisibilityCount < 3 && team === 'shemar') {
    invisible = true;
    alpha = 0;
    invisibilityCount += 1;
    timerAdjustInvisible = true;
    const data = {
      invis: invisible,
      alpha: alpha,
      iC: invisibilityCount,
      tAI: timerAdjustInvisible
    };
    window.Network.emitInvisible(data);
  } else if (keyIsDown(32) && team === 'ship') {
    BULLET = createSprite(width / 2, height / 2, 2, 10);
    BULLET.addImage(bulletImg);
    BULLET.velocity.y = 2;
    BULLET.velocity.x = random(-1, 1);
    BULLET.position.x = SHIP.position.x;
    BULLET.position.y = SHIP.position.y;
    bullets.push(BULLET);
    const data = {
      x: BULLET.position.x,
      y: BULLET.position.y,
      velocityY: BULLET.velocity.y,
      velocityX: BULLET.velocity.x
    };
    window.Network.emitShoot(data);
  } else if (keyIsDown(90) && lizardCount === 0 && team === 'ship') {
    LIZARD = createSprite(400, 0, 20, 20);
    LIZARD.addImage(lizardImg, width / 2, height / 2);
    LIZARD.velocity.y = 2;
    lizardCount++;
    lizardPenalty += 5;
    timer--;
    const data = {
      yV: LIZARD.velocity.y
    };
    window.Network.emitLizard(data);
  }
}

function droplets(xpos, ypos, size, rainColor) {
  noStroke();
  fill(255, 255, 255, rainColor);
  ellipse(xpos, ypos, size / 6, size);
}

function rainRun() {
  const vol = mic.getLevel() * 100;
  fill((vol * 0.5) + 19, (vol * 0.5) + 19, 19);
  const newDroplets = {
    xpos: random(0, window.width),
    ypos: 0,
    size: vol,
    rainColor: random(100, 255)
  };
  rainA.push(newDroplets);

  for (let i = 0; i < rainA.length; i++) {
    const currentObj = rainA[i];
    droplets(currentObj.xpos, currentObj.ypos, currentObj.size, currentObj.rainColor);
    currentObj.ypos += vol + random(2, 10);
    if (rainA[i].ypos > height + 20) {
      rainA.splice(i, 1);
    }
  }
}

function endGame(winningPlayer) {
  playerOneScore = 60 - timer - (invisibilityCount * 5);
  playerTwoScore = 0 + timer - lizardPenalty;

  if (winningPlayer === 'ship') {
    if (window.GameState.getTeam() === 'ship') {
      winningPlayerName = window.GameState.getPlayerName() || 'ship';
      for (const li of document.querySelectorAll('li')) {
        if (li.dataset.name === winningPlayerName) {
          nameFound = true;
          let newHighScore;
          const win = Number(li.dataset.win) + 1;
          if (li.dataset.score < playerTwoScore) {
            newHighScore = playerTwoScore;
          } else {
            newHighScore = li.dataset.score;
          }
          const configObj = {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              name: winningPlayerName,
              win: win,
              score: newHighScore
            })
          };
          if (winningPlayer !== undefined) {
            fetch(`${window.GameConstants.BASE_URL}api/v1/users/${li.dataset.id}`, configObj)
              .then(response => response.json())
              .then(json => {
                const liTag = document.getElementById(li.dataset.id);
                liTag.innerText = `<li data-id="${json.id}" data-name="${json.name}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${json.name}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
              </li>`;
              });
          }
        }
      }
    }
    if (window.GameState.getTeam() === 'ship' && nameFound === false) {
      const configObj = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: winningPlayerName,
          win: 1,
          score: playerTwoScore
        })
      };

      if (winningPlayer !== undefined) {
        fetch(`${window.GameConstants.BASE_URL}api/v1/users`, configObj)
          .then(response => response.json())
          .then(json => {
            ulTag.innerHTML += `<li data-id="${json.id}" data-name="${json.name}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${json.name}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
          </li>`;
          });
      }
    }
  }

  if (winningPlayer === 'shemar') {
    if (window.GameState.getTeam() === 'shemar') {
      winningPlayerName = window.GameState.getPlayerName() || 'shemar';
    }
    for (const li of document.querySelectorAll('li')) {
      if (li.dataset.name === winningPlayerName) {
        nameFound = true;
        let newHighScore;
        const win = Number(li.dataset.win) + 1;
        if (li.dataset.score < playerOneScore) {
          newHighScore = playerTwoScore;
        } else {
          newHighScore = li.dataset.score;
        }
        const configObj = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name: winningPlayerName,
            win: win,
            score: newHighScore
          })
        };
        if (winningPlayer !== undefined) {
          fetch(`${window.GameConstants.BASE_URL}api/v1/users/${li.dataset.id}`, configObj)
            .then(response => response.json())
            .then(json => {
              const liTag = document.getElementById(li.dataset.id);
              liTag.innerText = `<li data-id="${json.id}" data-name="${json.name}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${json.name}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
            </li>`;
            });
        }
      }
    }
  } else if (window.GameState.getTeam() === 'shemar' && nameFound === false) {
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: winningPlayerName,
        win: 1,
        score: playerOneScore
      })
    };

    if (winningPlayer !== undefined) {
      fetch(`${window.GameConstants.BASE_URL}api/v1/users`, configObj)
        .then(response => response.json())
        .then(json => {
          const localName = window.GameState.getPlayerName() || 'shemar';
          ulTag.innerHTML += `<li data-id="${json.id}" data-name="${localName}" data-win="${json.win}" data-score="${json.score}" id="${json.id}"><b id="white">${localName}</b> <b>Ws:</b> ${json.win} / <i>High Score: ${json.score}</i>
        </li>`;
        });
    }
  }
}

function randomDirection() {
  return (Math.floor(Math.random() * 2) === 0) ? platformX = 20 : platformX = 800;
}

window.togglemenu = function togglemenu() {
  const sidebar = document.querySelector('.sidebar');
  const btn = document.querySelector('.sidebar-btn');
  const links = document.querySelector('.sidebar ul');
  const arrow1 = document.querySelector('.sidebar-btn span:nth-child(1)');
  const arrow2 = document.querySelector('.sidebar-btn span:nth-child(2)');
  const arrow3 = document.querySelector('.sidebar-btn span:nth-child(3)');

  if (!sidebar || !btn || !links || !arrow1 || !arrow2 || !arrow3) {
    return;
  }

  sidebar.classList.toggle('visible');
  btn.classList.toggle('open');
  links.classList.toggle('display');
  arrow1.classList.toggle('topRotate');
  arrow3.classList.toggle('buttomRotate');
  arrow2.classList.toggle('arrow');
};
