class Platform {
  sprite() {
    let newPlatform;

    let yMin = 320;
    let yMax = 350;
    let rY = Math.floor(Math.random() * (+yMax - +yMin)) + +yMin;

    let wMin = 35;
    let wMax = 65;
    let rW = Math.floor(Math.random() * (+wMax - +wMin)) + +wMin;

    let pSpecs = {
        y: rY,
        w: rW
    }

     return pSpecs
  }
}
