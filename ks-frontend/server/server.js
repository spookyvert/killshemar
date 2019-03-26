const http = require('http');

let handleRequest = function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  response.end('Hello World\n');
};

let server = http.createServer(handleRequest);
const io = require('socket.io').listen(server)




server.listen(8000);
console.log("Server is running on http://localhost:8000 ")

io.sockets.on('connection', (socket) => {


  socket.on('mouse',
    function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'mouse' " + data.x + " " + data.y);
      // Send it to all other clients
      socket.broadcast.emit('mouse', data);

    }
  );

  socket.on('shoot',
    function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'shoot' " + data.x + " " + data.y);
      // Send it to all other clients
      socket.broadcast.emit('shoot', data);


    }
  );

  socket.on('platform1',
    function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'platform1' " + data.x + " " + data.y);
      // Send it to all other clients
      socket.broadcast.emit('platform1', data);


    }
  );

  socket.on('platform2',
    function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'platform2' " + data.x + " " + data.y);
      // Send it to all other clients
      socket.broadcast.emit('platform2', data);


    }
  );

  socket.on('linearS1',
    function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'linearS1' " + data.x);
      // Send it to all other clients
      socket.broadcast.emit('linearS1', data);


    }
  );

  socket.on('jumpS1',
    function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'jumpS1' " + data.y);
      // Send it to all other clients
      socket.broadcast.emit('jumpS1', data);


    }
  );



  console.log("running")

})