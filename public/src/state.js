(() => {
  const { STATES } = window.GameConstants;

  const state = {
    phase: STATES.MENU,
    connectionStatus: 'disconnected',
    session: {
      id: window.GameConstants.SESSION_ID,
      hostPresent: false,
      guestPresent: false,
      locked: false,
      started: false,
      hostReady: false,
      guestReady: false
    },
    playerName: '',
    team: null
  };

  const GameState = {
    getPhase() {
      return state.phase;
    },
    setPhase(phase) {
      state.phase = phase;
    },
    isMatch() {
      return state.phase === STATES.MATCH;
    },
    isLobby() {
      return state.phase === STATES.LOBBY;
    },
    setConnectionStatus(status) {
      state.connectionStatus = status;
    },
    getConnectionStatus() {
      return state.connectionStatus;
    },
    setSessionStatus(sessionStatus) {
      state.session = { ...state.session, ...sessionStatus };
    },
    getSessionStatus() {
      return { ...state.session };
    },
    setPlayerName(name) {
      state.playerName = name;
    },
    getPlayerName() {
      return state.playerName;
    },
    setTeam(team) {
      state.team = team;
    },
    getTeam() {
      return state.team;
    }
  };

  window.GameState = GameState;
})();
