'use strict';

// var express = require('express'),
// 	http = require('http');
// var app = express();
// var server = http.createServer(app);
// var io = require('socket.io').listen(server);
//
// server.listen(3000);

const express = require('express');

const path = require('path');

const PORT = process.env.PORT || 8000;
// const INDEX = path.join(__dirname, 'index.html');

const app = express();
const socketIO = require('socket.io');
const server = express()
	.use(app)
	.listen(PORT, () => console.log(`Listening Socket on ${ PORT }`));

const io = socketIO(server);

// Heroku won 't actually allow us to use WebSockets
// so we have to setup polling instead.
// https: //devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
//




//  initalliy setting both players to false, meaning they arent set yet

let playerIndex = 0
console.log("Server is running 😌 ")

// resets back to false
let hasShemar = false;
let hasShip = false;

io.on('connection', (socket) => {


	// sets player controls
	if (!hasShemar) {
		socket.emit('team', 'shemar')
		hasShemar = true
	} else if (!hasShip) {
		// the first player that joins will be the Ship! so the 2nd will always be Shemar
		socket.emit('team', 'ship')
		hasShip = true
	}

	playerIndex++

	console.log("new user connected! 😛 ")
	console.log("players count: " + playerIndex)


	socket.on('disconnect', function() {
		// set it to false when they leave
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


});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
