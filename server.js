

const express = require('express');
const path = require('path');


const socketIO = require('socket.io');

const PORT = process.env.PORT || 8000;

const INDEX = path.join(__dirname, 'index.html');


const server = express()
  .use('/public', express.static('public'))
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = socketIO(server);


//  initalliy setting both players to false, meaning they arent set yet

let playerIndex = 0;
console.log('Server is running 😌 ');

  // resets back to false
let hasShemar = false;
let hasShip = false;

io.on('connection', (socket) => {
  console.log(socket.id);





  if (hasShemar === false) {
    socket.broadcast.emit('team', 'shemar');
    hasShemar = true;
  } 
  if (hasShemar !== false) {
    // the first player that joins will be the Shemar! so the 2nd will always be Ship
    socket.broadcast.emit('team', 'ship');
    hasShip = true;
  }


  playerIndex++;



  console.log('new user connected! 😛 ');


  socket.on('disconnect', () => {
    // set it to false when they leave
    hasShip = false;
    hasShemar = false;

    playerIndex--;

    console.log(111, 'user left! ' + playerIndex + ' left');
  });


  socket.broadcast.emit('player-number', playerIndex);

  if (playerIndex === 2) {
    const two = true;
    // disease
    console.log(2, two);

    // socket.broadcast.emit('player-two', two);
  }


  socket.on('startGame', (data) => {
    console.log(`Received: 'startGame' ${  data.start}`);
    socket.broadcast.emit('startGame', data);
  });

  socket.on('mouse', (data) => {
    console.log(`Received: 'mouse' ${  data.x  } ${  data.y}`);
    socket.broadcast.emit('mouse', data);
  });

  socket.on('shoot', (data) => {
    console.log(`Received: 'shoot' ${  data.x  } ${  data.y}`);
    socket.broadcast.emit('shoot', data);
  });

  socket.on('platform1', (data) => {
    console.log(`Received: 'platform1' ${  data.x  } ${  data.y}`);
    socket.broadcast.emit('platform1', data);
  });

  socket.on('platform2', (data) => {
    console.log(`Received: 'platform2' ${  data.x  } ${  data.y}`);
    socket.broadcast.emit('platform2', data);
  });

  socket.on('linearS1', (data) => {
    socket.broadcast.emit('linearS1', data);
  });

  socket.on('invisible', (data) => {
    console.log("Received: 'invisible' ");
    socket.broadcast.emit('invisible', data);
  });

  socket.on('lizard', (data) => {
    console.log("Received: 'lizard' ");
    socket.broadcast.emit('lizard', data);
  });

  socket.on('jumpS1', (data) => {
    console.log(`Received: 'jumpS1' ${  data.y}`);
    socket.broadcast.emit('jumpS1', data);
  });

  socket.on('portal', (data) => {
    console.log(`Received: 'portal' ${  data.y}`);
    socket.broadcast.emit('portal', data);
  });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
