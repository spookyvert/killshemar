(() => {
  function boot() {
    if (window.UI && window.UI.initStatusUI) {
      window.UI.initStatusUI();
      window.UI.updateScoreboard();
      window.UI.forceCanvasVisible();
    }
    if (window.Network && window.Network.init) {
      window.Network.init();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
