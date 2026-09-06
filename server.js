'use strict';

const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const { Redis } = require('@upstash/redis');

const PORT = process.env.PORT || 8000;
const INDEX = path.join(__dirname, 'index.html');
const SESSION_KEY = 'killshemar:session';
const LOCK_KEY = 'killshemar:lock';
const SESSION_TTL_SECONDS = 60 * 60;
const GRACE_MS = 90 * 1000;

const emptySession = () => ({
  id: 'default',
  hostId: null,
  guestId: null,
  hostName: null,
  guestName: null,
  hostReady: false,
  guestReady: false,
  locked: false,
  started: false,
  hostLeftAt: null,
  guestLeftAt: null,
});

const memory = { session: emptySession() };

function createRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = createRedis();

function isPresent(id, leftAt) {
  return Boolean(id) && !slotExpired(leftAt);
}

function publicStatus(session) {
  return {
    id: session.id,
    hostPresent: isPresent(session.hostId, session.hostLeftAt),
    guestPresent: isPresent(session.guestId, session.guestLeftAt),
    locked: Boolean(session.locked),
    started: Boolean(session.started),
    hostReady: Boolean(session.hostReady),
    guestReady: Boolean(session.guestReady),
  };
}

function slotExpired(leftAt) {
  return Boolean(leftAt) && Date.now() - leftAt > GRACE_MS;
}

function sweepExpired(session) {
  if (slotExpired(session.hostLeftAt)) {
    session.hostId = null;
    session.hostName = null;
    session.hostReady = false;
    session.hostLeftAt = null;
    session.locked = false;
    session.started = false;
  }
  if (slotExpired(session.guestLeftAt)) {
    session.guestId = null;
    session.guestName = null;
    session.guestReady = false;
    session.guestLeftAt = null;
    session.locked = false;
    session.started = false;
  }
  return session;
}

async function withLock(fn) {
  if (!redis) return fn();
  const got = await redis.set(LOCK_KEY, '1', { nx: true, px: 2500 });
  if (!got) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return withLock(fn);
  }
  try {
    return await fn();
  } finally {
    await redis.del(LOCK_KEY);
  }
}

async function loadSession() {
  if (!redis) return sweepExpired({ ...memory.session });
  const stored = await redis.get(SESSION_KEY);
  const session = stored && typeof stored === 'object' ? stored : emptySession();
  return sweepExpired(session);
}

async function saveSession(session) {
  memory.session = session;
  if (!redis) return;
  await redis.set(SESSION_KEY, session, { ex: SESSION_TTL_SECONDS });
}

const app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.sendFile(INDEX));

const server = http.createServer(app);
const io = new Server(server, {
  transports: ['websocket'],
  cors: { origin: '*' },
});

async function attachRedisAdapter() {
  const redisUrl = process.env.REDIS_URL || process.env.KV_URL;
  if (!redisUrl) return;
  const { createAdapter } = require('@socket.io/redis-adapter');
  const IORedis = require('ioredis');
  const pubClient = new IORedis(redisUrl, { maxRetriesPerRequest: null });
  const subClient = pubClient.duplicate();
  const waitReady = (client) =>
    client.status === 'ready'
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
          client.once('ready', resolve);
          client.once('error', reject);
        });
  await Promise.all([waitReady(pubClient), waitReady(subClient)]);
  io.adapter(createAdapter(pubClient, subClient));
}

function emitStatus(session) {
  io.emit('session:status', publicStatus(session));
}

function tryStart(session) {
  if (session.hostId && session.guestId && session.hostReady && session.guestReady) {
    session.locked = true;
    session.started = true;
    io.emit('session:started', { id: session.id });
    io.emit('startGame', { start: true });
    return true;
  }
  return false;
}

function slotOpen(id, leftAt) {
  return !id || Boolean(leftAt);
}

function takeHost(session, socket, name, resetReady) {
  session.hostId = socket.id;
  session.hostName = name;
  session.hostLeftAt = null;
  if (resetReady) session.hostReady = false;
  return 'shemar';
}

function takeGuest(session, socket, name, resetReady) {
  session.guestId = socket.id;
  session.guestName = name;
  session.guestLeftAt = null;
  if (resetReady) session.guestReady = false;
  return 'ship';
}

function assignRole(session, socket, name, resumeRole) {
  if (session.hostId === socket.id) return 'shemar';
  if (session.guestId === socket.id) return 'ship';
  if (session.hostName === name && resumeRole !== 'ship') {
    return takeHost(session, socket, name, false);
  }
  if (session.guestName === name && resumeRole !== 'shemar') {
    return takeGuest(session, socket, name, false);
  }
  if (resumeRole === 'shemar' && slotOpen(session.hostId, session.hostLeftAt)) {
    return takeHost(session, socket, name, true);
  }
  if (resumeRole === 'ship' && slotOpen(session.guestId, session.guestLeftAt)) {
    return takeGuest(session, socket, name, true);
  }
  if (slotOpen(session.hostId, session.hostLeftAt)) {
    return takeHost(session, socket, name, true);
  }
  if (slotOpen(session.guestId, session.guestLeftAt)) {
    return takeGuest(session, socket, name, true);
  }
  return null;
}

io.on('connection', (socket) => {
  loadSession().then((session) => {
    socket.emit('session:status', publicStatus(session));
  });

  socket.on('session:status', async () => {
    socket.emit('session:status', publicStatus(await loadSession()));
  });

  async function claimSession(data) {
    const name = String((data && data.name) || `Player${Math.floor(Math.random() * 9000) + 1000}`);
    const resumeRole = data && data.resumeRole;
    const result = await withLock(async () => {
      const session = await loadSession();
      const role = assignRole(session, socket, name, resumeRole);
      if (!role) {
        return { error: 'Match is full. Refresh when a slot opens.' };
      }
      await saveSession(session);
      return { role, name, session };
    });

    if (result.error) {
      socket.emit('session:error', { message: result.error });
      return;
    }

    socket.emit('player:role', { role: result.role, name: result.name });
    if (result.role === 'shemar') {
      socket.emit('session:created', { id: result.session.id });
    } else {
      socket.emit('session:joined', { id: result.session.id });
    }
    emitStatus(result.session);
  }

  socket.on('session:claim', claimSession);
  socket.on('session:create', claimSession);
  socket.on('session:join', (data) => claimSession({ ...data, resumeRole: data && data.resumeRole ? data.resumeRole : undefined }));

  socket.on('session:heartbeat', async (data) => {
    await withLock(async () => {
      const session = await loadSession();
      const name = data && data.name;
      let changed = false;
      if (session.hostId === socket.id || session.hostName === name) {
        changed = session.hostId !== socket.id || Boolean(session.hostLeftAt);
        session.hostId = socket.id;
        session.hostLeftAt = null;
      } else if (session.guestId === socket.id || session.guestName === name) {
        changed = session.guestId !== socket.id || Boolean(session.guestLeftAt);
        session.guestId = socket.id;
        session.guestLeftAt = null;
      } else {
        return;
      }
      if (!changed) return;
      await saveSession(session);
      emitStatus(session);
    });
  });

  socket.on('session:ready', async (data) => {
    const result = await withLock(async () => {
      const session = await loadSession();
      const name = data && data.name;
      if (session.hostId === socket.id || session.hostName === name) {
        session.hostId = socket.id;
        session.hostLeftAt = null;
        session.hostReady = true;
      } else if (session.guestId === socket.id || session.guestName === name) {
        session.guestId = socket.id;
        session.guestLeftAt = null;
        session.guestReady = true;
      } else return { error: 'You are not in the session.' };
      if (session.hostId && session.guestId) session.locked = true;
      const started = tryStart(session);
      await saveSession(session);
      return { session, started };
    });

    if (result.error) {
      socket.emit('session:error', { message: result.error });
      return;
    }
    emitStatus(result.session);
  });

  socket.on('disconnect', async () => {
    await withLock(async () => {
      const session = await loadSession();
      const now = Date.now();
      if (session.hostId === socket.id) {
        session.hostLeftAt = now;
      }
      if (session.guestId === socket.id) {
        session.guestLeftAt = now;
      }
      await saveSession(session);
      emitStatus(session);
    });
  });

  const relay = (event) => {
    socket.on(event, (data) => {
      socket.broadcast.emit(event, data);
    });
  };

  ['startGame', 'mouse', 'shoot', 'platform1', 'platform2', 'linearS1', 'invisible', 'lizard', 'jumpS1', 'portal'].forEach(relay);
});

attachRedisAdapter().catch((error) => {
  console.warn('Redis adapter unavailable, using in-process sockets', error.message);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}

module.exports = server;
