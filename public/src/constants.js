(() => {
  const ASSETS = {
    fonts: {
      pressStart: './public/assets/fonts/PressStart2P.ttf'
    },
    images: {
      grass: './public/assets/images/grass.png',
      fame: './public/assets/images/fame.png',
      bullet: './public/assets/images/bullet.png',
      rocket: './public/assets/images/rocket.png',
      lizard: './public/assets/images/lizard.png',
      portal: './public/assets/images/portal.gif',
      rock: './public/assets/images/rock.png',
      cloud: './public/assets/images/cloud.png',
      background: './public/assets/images/background.png',
      topbg: './public/assets/images/topbg.png'
    },
    shemar: {
      leftJson: './public/assets/shemar/left.json',
      leftPng: './public/assets/shemar/left.png',
      rightJson: './public/assets/shemar/right.json',
      rightPng: './public/assets/shemar/right.png',
      jumpPng: './public/assets/shemar/up.png'
    }
  };

  const STATES = {
    MENU: 'menu',
    LOBBY: 'lobby',
    MATCH: 'match',
    DISCONNECTED: 'disconnected'
  };

  window.GameConstants = {
    BASE_URL: 'https://quiet-brushlands-57599.herokuapp.com/',
    SESSION_ID: 'default',
    STATES,
    ASSETS
  };
})();
