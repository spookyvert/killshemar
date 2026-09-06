(() => {
  const STORAGE_ROLE = 'killshemar:role';
  const STORAGE_NAME = 'killshemar:name';

  const Network = {
    socket: null,
    hasRequestedSession: false,
    pendingReady: false,

    init() {
      this.socket = io({
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 400,
        timeout: 10000,
      });
      this.registerCoreHandlers();
      this.registerGameplayHandlers();
    },

    registerCoreHandlers() {
      this.socket.on('connect', () => {
        window.GameState.setConnectionStatus('connected');
        window.UI.setConnectionStatus('Connected');
        this.hasRequestedSession = false;
        this.claimSeat();
        this.startHeartbeat();
      });

      this.socket.on('disconnect', () => {
        window.GameState.setConnectionStatus('disconnected');
        window.GameState.setPhase(window.GameConstants.STATES.DISCONNECTED);
        window.UI.setConnectionStatus('Disconnected');
        window.UI.setSessionStatus('Connection lost. Reconnecting...');
      });

      this.socket.on('session:status', (data) => {
        window.GameState.setSessionStatus(data);
        if (data.started) {
          window.GameState.setPhase(window.GameConstants.STATES.MATCH);
        } else if (data.hostPresent || data.guestPresent) {
          if (window.GameState.getTeam()) {
            window.GameState.setPhase(window.GameConstants.STATES.LOBBY);
          }
        }
        const team = window.GameState.getTeam() || sessionStorage.getItem(STORAGE_ROLE);
        const missing =
          (team === 'shemar' && !data.hostPresent) || (team === 'ship' && !data.guestPresent);
        if (missing && this.socket.connected && Date.now() - (this._reclaimAt || 0) > 2000) {
          this._reclaimAt = Date.now();
          this.hasRequestedSession = false;
          this.claimSeat();
        }
        if (data.hostPresent && data.guestPresent && !data.started) {
          const readyCount = (data.hostReady ? 1 : 0) + (data.guestReady ? 1 : 0);
          window.UI.setSessionStatus(`Both players here. Ready ${readyCount}/2.`);
        }
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
      });

      this.socket.on('session:created', () => {
        window.GameState.setPhase(window.GameConstants.STATES.LOBBY);
        window.UI.setLobbyStatus('You are Shemar. Waiting for Player 2...');
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
      });

      this.socket.on('session:joined', () => {
        window.GameState.setPhase(window.GameConstants.STATES.LOBBY);
        window.UI.setLobbyStatus('You are the ship. Click Ready when both players are in.');
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
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
        sessionStorage.removeItem(STORAGE_ROLE);
        sessionStorage.removeItem(STORAGE_NAME);
        window.GameState.setTeam(null);
        window.GameState.setPhase(window.GameConstants.STATES.MENU);
        window.UI.setLobbyStatus('Session reset. Claiming a new seat...');
        if (window.GameActions && window.GameActions.setGameStarted) {
          window.GameActions.setGameStarted(false);
        }
        this.hasRequestedSession = false;
        this.claimSeat();
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
        }
      });

      this.socket.on('session:error', (data) => {
        window.UI.setSessionStatus(data.message || 'Unable to join session.');
        this.hasRequestedSession = false;
        if (!this._retryClaim) {
          this._retryClaim = setTimeout(() => {
            this._retryClaim = null;
            this.claimSeat();
          }, 2000);
        }
      });

      this.socket.on('player:role', (data) => {
        sessionStorage.setItem(STORAGE_ROLE, data.role);
        sessionStorage.setItem(STORAGE_NAME, data.name);
        window.GameState.setTeam(data.role);
        window.GameState.setPlayerName(data.name);
        if (window.GameActions && window.GameActions.setTeam) {
          window.GameActions.setTeam(data.role);
        }
        if (this.pendingReady) {
          this.pendingReady = false;
          this.emitReady();
        }
        if (window.GameActions && window.GameActions.refreshUI) {
          window.GameActions.refreshUI();
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

    restoreSeat() {
      const storedRole = sessionStorage.getItem(STORAGE_ROLE);
      const storedName = sessionStorage.getItem(STORAGE_NAME);
      if (storedName) window.GameState.setPlayerName(storedName);
      if (storedRole && !window.GameState.getTeam()) {
        window.GameState.setTeam(storedRole);
        if (window.GameActions && window.GameActions.setTeam) {
          window.GameActions.setTeam(storedRole);
        }
      }
      return { storedRole, storedName };
    },

    claimSeat() {
      if (this.hasRequestedSession || !this.socket || !this.socket.connected) return;
      this.hasRequestedSession = true;
      const { storedRole, storedName } = this.restoreSeat();
      const name = storedName || window.GameState.getPlayerName() || this.generatePlayerName();
      window.GameState.setPlayerName(name);
      this.socket.emit('session:claim', {
        name,
        resumeRole: storedRole || undefined,
      });
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
      this.restoreSeat();
      const team = window.GameState.getTeam();
      if (!team) {
        this.pendingReady = true;
        this.hasRequestedSession = false;
        this.claimSeat();
        return;
      }
      this.socket.emit('session:ready', {
        name: window.GameState.getPlayerName() || sessionStorage.getItem(STORAGE_NAME),
      });
    },

    startHeartbeat() {
      if (this._heartbeat) return;
      this._heartbeat = setInterval(() => {
        if (!this.socket || !this.socket.connected) return;
        const name = window.GameState.getPlayerName() || sessionStorage.getItem(STORAGE_NAME);
        if (!name) return;
        this.socket.emit('session:heartbeat', { name });
      }, 4000);
    }
  };

  window.Network = Network;
})();
