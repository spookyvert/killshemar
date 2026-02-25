(() => {
  const touchState = {
    left: false,
    right: false,
    up: false,
    down: false
  };

  const Input = {
    left() {
      return keyIsDown(LEFT_ARROW) || touchState.left;
    },
    right() {
      return keyIsDown(RIGHT_ARROW) || touchState.right;
    },
    up() {
      return keyIsDown(UP_ARROW) || touchState.up;
    },
    down() {
      return keyIsDown(DOWN_ARROW) || touchState.down;
    },
    setTouch(direction, isActive) {
      if (touchState[direction] === undefined) {
        return;
      }
      touchState[direction] = isActive;
    },
    clearTouch() {
      touchState.left = false;
      touchState.right = false;
      touchState.up = false;
      touchState.down = false;
    }
  };

  window.Input = Input;
})();
