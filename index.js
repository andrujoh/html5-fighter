const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// canvas.width = 1024;
// canvas.height = 576;
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 20;
// canvas.style.backgroundColor = "red";
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const player = new Fighter({
  position: { x: 100, y: 0 },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});
const enemy = new Fighter({
  position: { x: canvas.width - 200, y: 0 },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: "blue",
});

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowUp: { pressed: false },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  player.update();
  enemy.update();

  // player 1
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -player.movementSpeed;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = player.movementSpeed;
  }

  // enemy/player 2
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -enemy.movementSpeed;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = enemy.movementSpeed;
  }

  // detect player 1 for collision
  if (rectangularCollision(player, enemy) && player.isAttacking) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // detect player 2 / enemy for collision
  if (rectangularCollision(enemy, player) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", event => {
  const keyMapping = {
    Shift: () => {
      enemy.attack();
    },
    ArrowUp: () => {
      // keys.ArrowUp.pressed = true;
      enemy.velocity.y = -15;
    },
    ArrowDown: () => {},
    ArrowLeft: () => {
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
    },
    ArrowRight: () => {
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
    },
    // space
    " ": () => {
      player.attack();
    },
    w: () => {
      keys.w.pressed = true;
      if (player.velocity.y === 0) {
        player.velocity.y = -15;
      }
    },
    s: () => {
      // crouch
      // player.height = 25;
    },
    d: () => {
      keys.d.pressed = true;
      player.lastKey = "d";
    },
    a: () => {
      keys.a.pressed = true;
      player.lastKey = "a";
    },
  };
  keyMapping[event.key]();
});

window.addEventListener("keyup", event => {
  switch (event.key) {
    // player 1 keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    // case "s":
    //   keys.s.pressed = false;
    //   break;

    // player 2 / enemy keys
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    // case "ArrowDown":
    //   keys.ArrowDown.pressed = false;
    //   break;
  }
});
