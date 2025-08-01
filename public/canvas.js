let gameStarted;
let team;

let hasShemar = false;
let hasShip = false;

let spreadsheet1
let spritedata1
let animationLeft = []

let spreadsheet2
let spritedata2
let animationRight = []
let count = 0

// Adjust speed and store image width for bgTop
let bgTopOffset1 = 0;
let bgTopOffset2 = 0;
let bgTopSpeed = 0.5; // Slower speed
let bgTopImgWidth; // Will be set in preload

function preload() {
	//font
	gameFont = loadFont('./public/assets/fonts/PressStart2P.ttf');
	// load images here
	spritedata1 = loadJSON('./public/assets/shemar/left.json')
	spritesheet1 = loadImage('./public/assets/shemar/left.png')

	spritedata2 = loadJSON('./public/assets/shemar/right.json')
	spritesheet2 = loadImage('./public/assets/shemar/right.png')

	jumpImg = loadImage('./public/assets/shemar/up.png')

	img = loadImage('./public/assets/images/grass.png');
	fameImg = loadImage('./public/assets/images/fame.png');

	bulletImg = loadImage('./public/assets/images/bullet.png');
	rocketImg = loadImage('./public/assets/images/rocket.png');
	lizardImg = loadImage('./public/assets/images/lizard.png');
	portalImg = loadImage('./public/assets/images/portal.gif');
	rockImg = loadImage('./public/assets/images/rock.png');
	cloudImg = loadImage('./public/assets/images/cloud.png');
	bg = loadImage('./public/assets/images/background.png');
	bgTop = loadImage('./public/assets/images/topbg.png');

}

function setup() {
	createCanvas(windowWidth, windowHeight);
	// Make canvas fill the whole screen and always resize responsively
	let cnv = document.querySelector('canvas');
	if (cnv) {
		cnv.style.position = 'fixed';
		cnv.style.top = '0';
		cnv.style.left = '0';
		cnv.style.width = '100vw';
		cnv.style.height = '100vh';
		cnv.style.zIndex = '1';
	}

	// Create an Audio input
	mic = new p5.AudioIn();
	// start the Audio Input.
	// By default, it does not .connect() (to the computer speakers)
	mic.start();

	// set gameStarted equal to false
	gameStarted = false;



	PORTAL = createSprite(portal.x, portal.y, portal.w, portal.h)
	PORTAL.addImage(portalImg)

	ROCK = createSprite(portal.x + 890, portal.y + 30, portal.w, portal.h)
	ROCK.addImage(rockImg)


	SHEMAR = createSprite(playerOne.x, playerOne.y, playerOne.w, playerOne.h);

	let leftFrames = spritedata1.frames
	let rightFrames = spritedata2.frames

	for (i in leftFrames) {
		let pos = leftFrames[i].position

		let img = spritesheet1.get(pos.x, pos.y, pos.w, pos.h);
		animationLeft.push(img)
	}

	for (i in rightFrames) {
		let pos = rightFrames[i].position

		let img = spritesheet2.get(pos.x, pos.y, pos.w, pos.h);
		animationRight.push(img)
	}

	// being used?
	// SHEMAR.shapeColor = color(255, 0, 0, alpha);
	SHEMAR.velocity.y = 0;

	SHIP = createSprite(playerTwo.x, playerTwo.y, playerTwo.w, playerTwo.h);
	SHIP.addImage(rocketImg)
	SHIP.shapeColor = color(255);
	SHIP.rotateToDirection = true;
	SHIP.maxSpeed = 2;
	SHIP.friction = 0.99;

	let tmp = new Platform
	let tmp2 = new Platform
	let tmp3 = new Platform

	// platform 1
	let p = tmp.sprite()
	// platform 2
	let q = tmp2.sprite()
	// static platform
	let s = tmp.sprite()

	// Player Limit Checker
	socket.on('player-number', (data) => {
		if (data == 1) {
			console.log("Player 1 Has Joined")
			console.log("Waiting for Player 2")
		} else if (data == 2) {
			console.log("Player 2 Has Joined")

		} else if (data >= 3) {
			alert("Game is Full!")
		}

	});

	// team assigner
	socket.on('team', (data) => {


		team = data

		// puts Team( either ship or shemar ) name in Input box!
		document.querySelector('input').id += team;
	})

	socket.on('startGame', (data) => {
		gameStarted = data.start
	});

	socket.on('mouse', (data) => {
		SHIP.attractionPoint(70, data.x, data.y);
	});

	socket.on('shoot', (data) => {
		BULLET = createSprite(width / 4, height / 4, 2, 10);
		BULLET.addImage(bulletImg)
		BULLET.velocity.y = data.velocityY;
		BULLET.velocity.x = data.velocityX;
		BULLET.position.x = data.x;
		BULLET.position.y = data.y;

		bullets.push(BULLET)
		console.log('pew')
	});


	socket.on('linearS1', (data) => {

		SHEMAR.position.x = data.x
	});

	socket.on('invisible', (data) => {

		SHEMAR.hide()
		// invisible = data.invis,
		//   alpha = 0,
		//   invisibilityCount = data.iC,
		//   timerAdjustInvisible = data.tAI

	});

	socket.on('lizard', (data) => {
		LIZARD = createSprite(400, 0, 20, 20)
		LIZARD.addImage(lizardImg, width, height)
		LIZARD.velocity.y = data.yV

	});

	socket.on('jumpS1', (data) => {
		SHEMAR.velocity.y = data.Vy
	});

	socket.on('portal', (data) => {
		SHEMAR.position.y = data.y,
			SHEMAR.position.x = data.x,
			SHEMAR.velocity.x = data.vX,
			SHEMAR.velocity.y = data.vY

	});

	// socket.io end

	// platforms + socket.io
	// platforms come from different directions!
	randomDirection()

	platform1 = createSprite(platformX, p.y + random(100, 150), p.w, 20)
	platform1.addImage(cloudImg)

	let p1Data = {
		x: platformX,
		y: p.y,
		w: p.w
	}
	socket.emit('platform1', p1Data)

	socket.on('platform1', (data) => {
		// platform1 = createSprite(data.x, data.y, data.w, 20)
		platform1.position.x = data.x
		platform1.position.w = data.y
		platform1.width = data.w
		platform1.shapeColor = color(0, 255, 0);

	});

	platform2 = createSprite(platformX, p.y + random(150, 200), p.w, 20)
	platform2.addImage(cloudImg)

	let plaformData2 = {
		x: platformX,
		y: p.y - 50,
		w: p.w
	}
	socket.emit('platform2', plaformData2)

	socket.on('platform2', (data) => {
		platform2.position.x = data.x
		platform2.position.w = data.y
		platform2.width = data.w

		platform2.shapeColor = color(255, 0, 0);
	});

	platformSTATIC = createSprite(276, 355, 60, 20)
	platformSTATIC.addImage(cloudImg)

	// platforms + socket.io end

	// create clear button

	titleLogo = createElement('p', '🔪 Kill 🔪<br><br> Shemar').addClass('title');
	textH = createElement('h4', 'what is your name?').addClass('name');
	input = createInput().addClass('game-input'); // Add class here
	startButton = createButton('Start Game').addClass('eightbit-btn eightbit-btn--reset');

	positionUIElements(); // Responsive positioning

	// start button
	sB = document.querySelector('.eightbit-btn')

	// starts the game!
	sB.addEventListener('click', (event) => {
		gameStarted = true;

		i = document.querySelector('input')
		console.log("Player Name: " + input.value() + " " + i.id);


		let data = {
			start: gameStarted
		}

		socket.emit('startGame', data)

	})

	// Store the original width of bgTop after it's loaded
	bgTopImgWidth = bgTop.width;
}
// setup() ends here

function draw() {
	// Responsive background: fill screen, no repeat on mobile
	if (windowWidth < 700) {
		// On mobile, stretch bg to fill the canvas (no repeat)
		image(bg, 0, 0, windowWidth, windowHeight);
	} else {
		// On desktop, tile as before
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
	let bgWave

	SHEMAR.addImage(animationLeft[count])


	// scene
	// wave()
	rainRun()

	// Responsive height for the "castle" strip
	const bgTopHeight = Math.ceil(windowHeight * 0.28);

	// Make castles (bgTop) bigger on mobile
	let scaleFactor = 1;
	if (windowWidth < 700) {
		scaleFactor = 1.7; // Increase for mobile, adjust as needed
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

	if (gameStarted == true) {

		menuBtn = document.querySelector('.sidebar-btn')
		menuBtn.style.display = 'block'


		if (invisible === true) {
			SHEMAR.shapeColor = color(255, 0, 0, alpha)
			if (alpha < 255) {
				alpha += 0.5
			} else if (alpha === 255) {
				invisible = false
			}
		}




		// shemar controls, weird glitch in mainMovementsDraw(), work here!
		if (keyIsDown(RIGHT_ARROW) && SHEMAR.position.x < windowWidth - 260 && team == 'shemar') {
			console.log("here");
			SHEMAR.addImage(animationRight[count])
			SHEMAR.position.x += 10;
			tmpCount = count
			tmpCount++
			if (tmpCount >= 3) {
				tmpCount = 0
			}
			count = tmpCount;

		} else if (keyIsDown(LEFT_ARROW) && SHEMAR.position.x > 10 && team == 'shemar') {
			SHEMAR.addImage(animationLeft[count])
			SHEMAR.position.x -= 10;
			tmpCount = count
			tmpCount++
			if (tmpCount >= 3) {
				tmpCount = 0
			}
			count = tmpCount;
		}

		let data2 = {
			x: SHEMAR.position.x
		}

		socket.emit('linearS1', data2)

		timerSetter()
		gameLogic()
		drawSprites();

		mainMovementsDraw()

	}

}

//  MOVEMENTS
function keyPressed() {
	mainMovements()
}

function positionUIElements() {
	// Create or select a flex container for UI elements
	let flexContainer = document.getElementById('ui-flex-container');
	if (!flexContainer) {
		flexContainer = document.createElement('div');
		flexContainer.id = 'ui-flex-container';
		document.body.appendChild(flexContainer);
	}
	// Style the flex container
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

	// Helper to move p5 elements into the flex container
	function moveToFlex(el) {
		if (el && el.elt && el.elt.parentNode !== flexContainer) {
			flexContainer.appendChild(el.elt);
		}
		if (el && el.style) {
			// .title will be fixed, not flexed
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
	moveToFlex(textH);
	moveToFlex(input);
	moveToFlex(startButton);

	// Hide or show the flex container depending on game state
	if (typeof gameStarted !== 'undefined' && gameStarted) {
		flexContainer.style.display = 'none';
	} else {
		flexContainer.style.display = 'flex';
	}
	// Always show the title and trigger animation
	if (titleLogo && titleLogo.elt) {
		titleLogo.show();
		animateShow(titleLogo);
	}
	// Animate the rest (slide from bottom and unblur)
	animateShow(textH);
	animateShow(input);
	animateShow(startButton);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	let cnv = document.querySelector('canvas');
	if (cnv) {
		cnv.style.width = '100vw';
		cnv.style.height = '100vh';
	}
	positionUIElements();
}

// Responsive ground layout: stretch grass image to cover bottom 30% of the screen, but preserve aspect ratio and fill horizontally
function groundLayout() {
	const groundHeight = Math.ceil(windowHeight * 0.3); // Use 0.3, not -5
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

	// Hide overflow below the grass by drawing a black rect after the grass
	image(
		img,
		x,
		y,
		drawWidth,
		drawHeight
	);

	// Draw a black rectangle below the grass to hide any overflow
	noStroke();
	fill(0);
	rect(0, windowHeight, windowWidth, 100); // 100px is enough to cover any overflow
}

// Responsive parallax wave
function wave() {
	bgWave = fill(19, 19, 19);
	bgWave
	noStroke();
	beginShape();

	let xoff = 0;
	// Make the wave much shorter on mobile
	let isMobile = windowWidth < 700;
	let waveTop = windowHeight * (isMobile ? 0.03 : 0.18);
	let waveBottom = windowHeight * (isMobile ? 0.10 : 0.28);

	for (let x = 0; x <= windowWidth; x += 10) {
		let y = map(noise(xoff, yoff), 0, 1, waveTop, waveBottom);
		vertex(x, y);
		xoff += 0.05;
	}
	yoff += 0.01;
	vertex(windowWidth, windowHeight); // bottom right
	vertex(0, windowHeight);           // bottom left
	endShape(CLOSE);
}

