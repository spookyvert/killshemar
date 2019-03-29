let spreadsheet1
let spritedata1
let spreadsheet2
let spritedata2
let a = []
let b = 0

function preload() {
  spritedata1 = loadJSON('shemar/left.json')
  spritesheet1 = loadImage('shemar/left.png')
  // spritedata2 = loadJSON('shemar/right.json')
  // spritesheet2 = loadJSON('shemar/right.png')
}

function setup() {
  createCanvas(640, 480)
  let frames = spritedata1.frames

  for (i in frames) {
    let pos = frames[i].position

    let img = spritesheet1.get(pos.x, pos.y, pos.w, pos.h);
    a.push(img)
  }
  console.log(spritedata1)
}

function draw() {

  background(255);
  image(a[b], 0, 0)





}