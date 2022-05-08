const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
// canvas.width = window.innerWidth - 10;
// canvas.height = window.innerHeight - 20;
// canvas.style.backgroundColor = "red";
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
  framesMax: 1,
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.755,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 100, y: 0 },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 215,
    y: 157,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./img/samuraiMack/Attack2.png",
      framesMax: 6,
    },
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
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 8,
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
  shop.update();
  player.update();
  // enemy.update();

  // player 1 movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -player.movementSpeed;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = player.movementSpeed;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // jumping
  if (player.velocity.y < 0) {
    // TODO: character lands and move down a few more pixels which prevents jumping again before velocity is 0
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy/player 2 movement
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
      // right Shift
      if (event.location === 2) {
        enemy.attack("attack1");
      }
    },
    Control: () => {
      // right Control
      if (event.location === 2) {
        enemy.attack("attack2");
      }
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
      player.attack("attack1");
    },
    f: () => {
      player.attack("attack2");
    },
    w: () => {
      keys.w.pressed = true;
      // if (player.velocity.y === 0) {
      player.velocity.y = -15;
      // }
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
  try {
    keyMapping[event.key]();
  } catch (error) {}
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
