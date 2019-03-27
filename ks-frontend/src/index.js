// Preloader
function randombg() {
  var random = Math.floor(Math.random() * 3) + 0;
  var bigSize = ["url('./assets/rollercoaster1.gif')",
    "url('./assests/rollercoaster2.gif')",
    "url('./assests/rollercoaster3.gif')"
  ];

  document.getElementById("loader").style.backgroundImage = bigSize[random];
}

function preloader() {
  setTimeout(showPage, 2500);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.querySelector("canvas").style.display = "block";
}


// high score
//
// ScoreAdaptor.getScores().then(scores => {
//   const scoreObject = scores.map(score => {
//
//
//     return score
//   });
// })