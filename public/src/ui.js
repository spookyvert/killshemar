(() => {
  const statusIds = {
    connection: 'connection-status',
    lobby: 'lobby-status',
    session: 'session-status'
  };

  function ensureElement(id, className) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      if (className) {
        el.className = className;
      }
      document.body.appendChild(el);
    }
    return el;
  }

  function initStatusUI() {
    const connection = ensureElement(statusIds.connection, 'status-pill');
    const lobby = ensureElement(statusIds.lobby, 'status-banner');
    const session = ensureElement(statusIds.session, 'status-banner');

    connection.textContent = 'Connecting...';
    lobby.textContent = '';
    session.textContent = '';
  }

  function setConnectionStatus(text) {
    const el = ensureElement(statusIds.connection, 'status-pill');
    el.textContent = text;
  }

  function setLobbyStatus(text) {
    const el = ensureElement(statusIds.lobby, 'status-banner');
    el.textContent = text;
  }

  function setSessionStatus(text) {
    const el = ensureElement(statusIds.session, 'status-banner');
    el.textContent = text;
  }

  function clearSessionStatus() {
    setSessionStatus('');
  }

  function clearLobbyStatus() {
    setLobbyStatus('');
  }

  function updateScoreboard() {
    if (!window.ScoreAdaptor || !window.ScoreAdaptor.getUsers) {
      return;
    }
    const ulTag = document.querySelector('#list');
    if (!ulTag) {
      return;
    }
    window.ScoreAdaptor.getUsers().then(players => {
      for (const user of players) {
        ulTag.innerHTML += `<li data-id="${user.id}" data-name="${user.name}" data-win="${user.win}" data-score="${user.score}" id="${user.id}"><b id="white">${user.name}</b> <b>Ws:</b> ${user.win} / <i>High Score: ${user.score}</i></li>`;
      }
    });
  }

  // Preloader utilities (used by index.html onload)
  function randombg() {
    const random = Math.floor(Math.random() * 3) + 0;
    const bigSize = [
      "url('./public/assets/rollercoaster1.gif')",
      "url('./public/assests/rollercoaster2.gif')",
      "url('./public/assests/rollercoaster3.gif')"
    ];

    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.backgroundImage = bigSize[random];
    }
  }

  function showPage() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
    forceCanvasVisible();
  }

  function preloader() {
    setTimeout(showPage, 2500);
  }

  function forceCanvasVisible() {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.style.display = 'block';
        clearInterval(interval);
      } else if (Date.now() - startedAt > 4000) {
        clearInterval(interval);
      }
    }, 200);
  }

  window.UI = {
    initStatusUI,
    setConnectionStatus,
    setLobbyStatus,
    setSessionStatus,
    clearSessionStatus,
    clearLobbyStatus,
    updateScoreboard,
    forceCanvasVisible
  };

  window.randombg = randombg;
  window.preloader = preloader;
})();
