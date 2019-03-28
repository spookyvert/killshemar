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
let ulTag = document.querySelector('ul')
<<<<<<< HEAD
let arrayOfLis;
=======
>>>>>>> a1e898a3a01b42413735e510501a3d88b9de913c

ScoreAdaptor.getUsers().then(players => {
  //array
  // players

<<<<<<< HEAD
  for(let user of players){
    ulTag.innerHTML += `<li data-id="${user.id}" data-name="${user.name}" data-win="${user.win}" data-score="${user.score}" id="${user.id}">Name: ${user.name} Wins: ${user.win} High Score: ${user.score}</li>`
  }
  arrayOfLis = ulTag.querySelectorAll('li')
  })
=======
  for (let user of players) {
    ulTag.innerHTML += `<li data-id="${user.id}" data-name="${user.name}" data-win="${user.win}" data-score="${user.score}" id="${user.id}">Name: ${user.name} Wins: ${user.win} High Score: ${user.score}</li>`
  }
  arrayOfLis = ulTag.querySelectorAll('li')
})
>>>>>>> a1e898a3a01b42413735e510501a3d88b9de913c
