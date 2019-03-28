const http = require('http');

let handleRequest = function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  response.end('Hello World\n');
};
let server = http.createServer(handleRequest);

const io = require('socket.io').listen(server)

//  initalliy setting both players to false, meaning they arent set yet
let hasShip = false;
let hasShemar = false;
let playerIndex = 0
server.listen(8000);
console.log("Server is running on http://localhost:8000 😌 ")


io.sockets.on('connection', (socket) => {

  // sets player controls
  if (!hasShip) {
    socket.emit('team', 'ship')
    hasShip = true
  } else if (!hasShemar) {
    socket.emit('team', 'shemar')
    hasShemar = true
  }

  playerIndex++

  console.log("new user connected! 😛 ")
  console.log("players count: " + playerIndex)


  socket.on('disconnect', function() {
    hasShip = false;
    hasShemar = false;
    socket.emit('team', 'shemar')
    playerIndex--

    console.log("user left! " + playerIndex + " left")

  });

  socket.emit('player-number', playerIndex);


  socket.on('startGame', function(data) {
    console.log("Received: 'startGame' " + data.start);
    socket.broadcast.emit('startGame', data);

  });

  socket.on('mouse', function(data) {
    console.log("Received: 'mouse' " + data.x + " " + data.y);
    socket.broadcast.emit('mouse', data);

  });

  socket.on('shoot', function(data) {
    console.log("Received: 'shoot' " + data.x + " " + data.y);
    socket.broadcast.emit('shoot', data);

  });

  socket.on('platform1', function(data) {
    console.log("Received: 'platform1' " + data.x + " " + data.y);
    socket.broadcast.emit('platform1', data);

  });

  socket.on('platform2', function(data) {
    console.log("Received: 'platform2' " + data.x + " " + data.y);
    socket.broadcast.emit('platform2', data);

  });

  socket.on('linearS1', function(data) {
    console.log("Received: 'linearS1' " + data.x);
    socket.broadcast.emit('linearS1', data);

  });

  socket.on('invisible', function(data) {
    console.log("Received: 'invisible' ");
    socket.broadcast.emit('invisible', data);

  });

  socket.on('lizard', function(data) {
    console.log("Received: 'lizard' ");
    socket.broadcast.emit('lizard', data);

  });

  socket.on('jumpS1', function(data) {
    console.log("Received: 'jumpS1' " + data.y);
    socket.broadcast.emit('jumpS1', data);

  });

  socket.on('portal', function(data) {
    console.log("Received: 'portal' " + data.y);
    socket.broadcast.emit('portal', data);

  });


})