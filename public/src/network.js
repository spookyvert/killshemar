(() => {
  const Network = {
    socket: null,
    hasRequestedSession: false,
    pendingReady: false,

    init() {
      this.socket = io();
      this.registerCoreHandlers();
      this.registerGameplayHandlers();
    },

    registerCoreHandlers() {
      this.socket.on('connect', () => {
        window.GameState.setConnectionStatus('connected');
        window.UI.setConnectionStatus('Connected');
        this.socket.emit('session:status', { id: window.GameConstants.SESSION_ID });
      });

      this.socket.on('disconnect', () => {
        window.GameState.setConnectionStatus('disconnected');
        window.GameState.setPhase(window.GameConstants.STATES.DISCONNECTED);
        window.UI.setConnectionStatus('Disconnected');
        window.UI.setSessionStatus('Connection lost. Refresh to reconnect.');
        this.hasRequestedSession = false;
      });

      this.socket.on('session:status', (data) => {
        window.GameState.setSessionStatus(data);
        if (data.locked) {
          const readyCount = (data.hostReady ? 1 : 0) + (data.guestReady ? 1 : 0);
          window.UI.setSessionStatus(`Session locked. Ready ${readyCount}/2.`);
        } else {
          window.UI.clearSessionStatus();
        }
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
        this.ensureSessionRequested();
      });

      this.socket.on('session:created', (data) => {
        window.GameState.setPhase(window.GameConstants.STATES.LOBBY);
        window.UI.setLobbyStatus('Waiting for Player 2...');
        window.UI.setSessionStatus(`Session ${data.id} created.`);
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
      });

      this.socket.on('session:joined', (data) => {
        window.GameState.setPhase(window.GameConstants.STATES.LOBBY);
        window.UI.setLobbyStatus('Joining match...');
        window.UI.setSessionStatus(`Joined session ${data.id}.`);
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
      });

      this.socket.on('session:locked', () => {
        window.UI.setSessionStatus('Session locked. Starting match...');
      });

      this.socket.on('session:started', () => {
        window.GameState.setPhase(window.GameConstants.STATES.MATCH);
        window.UI.clearLobbyStatus();
        window.UI.clearSessionStatus();
        if (window.GameActions && window.GameActions.setGameStarted) {
          window.GameActions.setGameStarted(true);
        }
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
      });

      this.socket.on('session:reset', () => {
        window.GameState.setPhase(window.GameConstants.STATES.MENU);
        window.UI.setLobbyStatus('Session reset. Start a new match.');
        if (window.GameActions && window.GameActions.setGameStarted) {
          window.GameActions.setGameStarted(false);
        }
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
        this.hasRequestedSession = false;
      });

      this.socket.on('session:error', (data) => {
        window.UI.setSessionStatus(data.message || 'Unable to join session.');
        if (data && data.message && data.message.toLowerCase().includes('not in the session')) {
          this.hasRequestedSession = false;
        }
      });

      this.socket.on('player:role', (data) => {
        window.GameState.setTeam(data.role);
        if (window.GameActions && window.GameActions.setTeam) {
          window.GameActions.setTeam(data.role);
        }
        if (this.pendingReady) {
          this.pendingReady = false;
          this.emitReady();
        }
      });
    },

    registerGameplayHandlers() {
      this.socket.on('startGame', (data) => {
        if (data && data.start) {
          window.GameState.setPhase(window.GameConstants.STATES.MATCH);
        }
        if (window.GameActions && window.GameActions.setGameStarted) {
          window.GameActions.setGameStarted(data.start);
        }
      });

      this.socket.on('mouse', (data) => {
        if (window.GameActions && window.GameActions.applyShipTarget) {
          window.GameActions.applyShipTarget(data);
        }
      });

      this.socket.on('shoot', (data) => {
        if (window.GameActions && window.GameActions.spawnBullet) {
          window.GameActions.spawnBullet(data);
        }
      });

      this.socket.on('platform1', (data) => {
        if (window.GameActions && window.GameActions.updatePlatform1) {
          window.GameActions.updatePlatform1(data);
        }
      });

      this.socket.on('platform2', (data) => {
        if (window.GameActions && window.GameActions.updatePlatform2) {
          window.GameActions.updatePlatform2(data);
        }
      });

      this.socket.on('linearS1', (data) => {
        if (window.GameActions && window.GameActions.updateShemarX) {
          window.GameActions.updateShemarX(data);
        }
      });

      this.socket.on('invisible', (data) => {
        if (window.GameActions && window.GameActions.applyInvisibility) {
          window.GameActions.applyInvisibility(data);
        }
      });

      this.socket.on('lizard', (data) => {
        if (window.GameActions && window.GameActions.spawnLizard) {
          window.GameActions.spawnLizard(data);
        }
      });

      this.socket.on('jumpS1', (data) => {
        if (window.GameActions && window.GameActions.applyJump) {
          window.GameActions.applyJump(data);
        }
      });

      this.socket.on('portal', (data) => {
        if (window.GameActions && window.GameActions.applyPortal) {
          window.GameActions.applyPortal(data);
        }
      });
    },

    requestSession(playerName) {
      const session = window.GameState.getSessionStatus();
      const resolvedName = playerName || this.generatePlayerName();
      window.GameState.setPlayerName(resolvedName);
      if (!session.hostPresent) {
        this.socket.emit('session:create', { id: session.id, name: resolvedName });
      } else if (!session.guestPresent && !session.locked) {
        this.socket.emit('session:join', { id: session.id, name: resolvedName });
      } else {
        this.socket.emit('session:join', { id: session.id, name: resolvedName });
      }
    },
    ensureSessionRequested() {
      if (this.hasRequestedSession && window.GameState.getTeam()) {
        return;
      }
      const name = window.GameState.getPlayerName() || this.generatePlayerName();
      this.hasRequestedSession = true;
      this.requestSession(name);
    },
    generatePlayerName() {
      const suffix = Math.floor(Math.random() * 9000) + 1000;
      return `Player${suffix}`;
    },

    emitStartGame(start) {
      if (!this.socket) return;
      this.socket.emit('startGame', { start });
    },

    emitShipTarget(data) {
      if (!this.socket) return;
      this.socket.emit('mouse', data);
    },

    emitShoot(data) {
      if (!this.socket) return;
      this.socket.emit('shoot', data);
    },

    emitPlatform1(data) {
      if (!this.socket) return;
      this.socket.emit('platform1', data);
    },

    emitPlatform2(data) {
      if (!this.socket) return;
      this.socket.emit('platform2', data);
    },

    emitShemarX(data) {
      if (!this.socket) return;
      this.socket.emit('linearS1', data);
    },

    emitInvisible(data) {
      if (!this.socket) return;
      this.socket.emit('invisible', data);
    },

    emitLizard(data) {
      if (!this.socket) return;
      this.socket.emit('lizard', data);
    },

    emitJump(data) {
      if (!this.socket) return;
      this.socket.emit('jumpS1', data);
    },

    emitPortal(data) {
      if (!this.socket) return;
      this.socket.emit('portal', data);
    },

    emitReady() {
      if (!this.socket) return;
      const team = window.GameState.getTeam();
      if (!team) {
        this.pendingReady = true;
        this.ensureSessionRequested();
        return;
      }
      this.socket.emit('session:ready');
    }
  };

  window.Network = Network;
})();
