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


ScoreAdaptor.getUsers().then(players => {
  //array
  // players

  for (let user of players) {

    ulTag.innerHTML += `<li data-id="${user.id}" data-name="${user.name}" data-win="${user.win}" data-score="${user.score}" id="${user.id}"><b id="white">${user.name}</b> <b>Ws:</b> ${user.win} / <i>High Score: ${user.score}</i></li>`


  }
  // arrayOfLis = ulTag.querySelectorAll('li')
})