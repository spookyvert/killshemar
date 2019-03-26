let min = 4;
let max = 5;
let random = Math.floor(Math.random() * (+max - +min)) + +min;
class Platform {



  sprite() {
    let newPlatform;

    let xMin = 35;
    let xMax = 60;
    let rX = Math.floor(Math.random() * (+xMax - +xMin)) + +xMin;
    // random number
    let yMin = 35;
    let yMax = 50;
    let rY = Math.floor(Math.random() * (+yMax - +yMin)) + +yMin;

    let wMin = 35;
    let wMax = 65;
    let rW = Math.floor(Math.random() * (+wMax - +wMin)) + +wMin;



    return newPlatform = createSprite(rX, rY, rW, 20)
  }



}