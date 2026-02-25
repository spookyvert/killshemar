'use strict';

const express = require('express');
const path = require('path');


const socketIO = require('socket.io');
const PORT = process.env.PORT || 8000;

const INDEX = path.join(__dirname, 'index.html');


const server = express()
	.use('/public', express.static('public'))
	.use((req, res) => res.sendFile(INDEX))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));


const io = socketIO(server);


console.log('Server is running 😌 ');

const SESSION_ID = 'default';
const session = {
	id: SESSION_ID,
	host: null,
	guest: null,
	locked: false,
	players: {},
	ready: {
		host: false,
		guest: false
	}
};

function getSessionStatus() {
	return {
		id: session.id,
		hostPresent: Boolean(session.host),
		guestPresent: Boolean(session.guest),
		locked: session.locked,
		hostReady: session.ready.host,
		guestReady: session.ready.guest
	};
}

function resetSession() {
	session.host = null;
	session.guest = null;
	session.locked = false;
	session.players = {};
	session.ready.host = false;
	session.ready.guest = false;
}

function lockSession(io) {
	session.locked = true;
	io.emit('session:locked', { id: session.id });
	io.emit('session:status', getSessionStatus());
}

function tryStartMatch(io) {
	if (session.host && session.guest && session.ready.host && session.ready.guest) {
		io.emit('session:started', { id: session.id });
		io.emit('startGame', { start: true });
	}
}

io.on('connection', (socket) => {


	console.log('new user connected! 😛 ');
	socket.emit('session:status', getSessionStatus());

	socket.on('session:status', () => {
		socket.emit('session:status', getSessionStatus());
	});

	socket.on('session:create', (data) => {
		if (session.host || session.locked) {
			socket.emit('session:error', { message: 'Session already has a host.' });
			return;
		}
		session.host = socket.id;
		session.players[socket.id] = { name: data.name, role: 'shemar' };
		session.ready.host = false;
		socket.emit('player:role', { role: 'shemar', name: data.name });
		socket.emit('session:created', { id: session.id });
		io.emit('session:status', getSessionStatus());
	});

	socket.on('session:join', (data) => {
		if (session.locked || session.guest) {
			socket.emit('session:error', { message: 'Session is locked.' });
			return;
		}
		if (!session.host) {
			socket.emit('session:error', { message: 'No host available. Create a session first.' });
			return;
		}
		session.guest = socket.id;
		session.players[socket.id] = { name: data.name, role: 'ship' };
		session.ready.guest = false;
		socket.emit('player:role', { role: 'ship', name: data.name });
		socket.emit('session:joined', { id: session.id });
		io.emit('session:status', getSessionStatus());
		lockSession(io);
	});

	socket.on('session:ready', () => {
		const player = session.players[socket.id];
		if (!player) {
			socket.emit('session:error', { message: 'You are not in the session.' });
			return;
		}
		if (player.role === 'shemar') {
			session.ready.host = true;
		}
		if (player.role === 'ship') {
			session.ready.guest = true;
		}
		if (session.host && session.guest) {
			lockSession(io);
		}
		io.emit('session:status', getSessionStatus());
		tryStartMatch(io);
	});

	socket.on('disconnect', function() {
		const wasHost = session.host === socket.id;
		const wasGuest = session.guest === socket.id;
		if (wasHost || wasGuest) {
			resetSession();
			io.emit('session:reset');
			io.emit('session:status', getSessionStatus());
		}
		console.log('user left!');
	});


	socket.on('startGame', function(data) {
		console.log("Received: 'startGame' " + data.start);
		io.emit('startGame', data);

	});

	socket.on('mouse', function(data) {
		console.log("Received: 'mouse' " + data.x + " " + data.y);
		io.emit('mouse', data);

	});

	socket.on('shoot', function(data) {
		console.log("Received: 'shoot' " + data.x + " " + data.y);
		io.emit('shoot', data);

	});

	socket.on('platform1', function(data) {
		console.log("Received: 'platform1' " + data.x + " " + data.y);
		io.emit('platform1', data);

	});

	socket.on('platform2', function(data) {
		console.log("Received: 'platform2' " + data.x + " " + data.y);
		io.emit('platform2', data);

	});

	socket.on('linearS1', function(data) {
		console.log("Received: 'linearS1' " + data.x);
		io.emit('linearS1', data);

	});

	socket.on('invisible', function(data) {
		console.log("Received: 'invisible' ");
		io.emit('invisible', data);

	});

	socket.on('lizard', function(data) {
		console.log("Received: 'lizard' ");
		io.emit('lizard', data);

	});

	socket.on('jumpS1', function(data) {
		console.log("Received: 'jumpS1' " + data.y);
		io.emit('jumpS1', data);

	});

	socket.on('portal', function(data) {
		console.log("Received: 'portal' " + data.y);
		io.emit('portal', data);

	});


});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
