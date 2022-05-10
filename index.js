const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
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
	// spawn location
	offset: {
		x: 215,
		y: 157, // take in consideration how tall the character is
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
		takeHit: {
			imageSrc: "./img/samuraiMack/Take Hit.png",
			framesMax: 4,
		},
		death: {
			imageSrc: "./img/samuraiMack/Death.png",
			framesMax: 6,
		},
	},
	attackBox: {
		offset: {
			x: 70,
			y: 50,
		},
		width: 185,
		height: 50,
	},
});

const enemy = new Fighter({
	position: { x: canvas.width - 200, y: 0 },
	velocity: {
		x: 0,
		y: 0,
	},
	// spawn location
	offset: {
		x: 200,
		y: 167, // take in consideration how tall the character is
	},
	// color: "blue",
	imageSrc: "./img/kenji/Idle.png",
	framesMax: 4,
	scale: 2.5,
	sprites: {
		idle: {
			imageSrc: "./img/kenji/Idle.png",
			framesMax: 4,
		},
		run: {
			imageSrc: "./img/kenji/Run.png",
			framesMax: 8,
		},
		jump: {
			imageSrc: "./img/kenji/Jump.png",
			framesMax: 2,
		},
		fall: {
			imageSrc: "./img/kenji/Fall.png",
			framesMax: 2,
		},
		attack1: {
			imageSrc: "./img/kenji/Attack1.png",
			framesMax: 4,
		},
		attack2: {
			imageSrc: "./img/kenji/Attack2.png",
			framesMax: 4,
		},
		takeHit: {
			imageSrc: "./img/kenji/Take Hit.png",
			framesMax: 3,
		},
		death: {
			imageSrc: "./img/kenji/Death.png",
			framesMax: 7,
		},
	},
	attackBox: {
		offset: {
			x: -155,
			y: 50,
		},
		width: 170,
		height: 50,
	},
});

const keys = {
	a: { pressed: false },
	d: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowRight: { pressed: false },
};

decreaseTimer();

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);

	background.update();
	shop.update();
	c.fillStyle = "rgba(255,255,255, 0.15)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// player 1 movement
	if (keys.a.pressed && player.lastKey === "a") {
		player.switchSprite("run");
		if (player.position.x >= 0) {
			player.velocity.x = -player.movementSpeed;
		}
	} else if (keys.d.pressed && player.lastKey === "d") {
		player.switchSprite("run");
		if (player.position.x <= canvas.width - player.width - 15) {
			// Don't run past screen
			player.velocity.x = player.movementSpeed;
		}
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
	if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		enemy.switchSprite("run");
		if (enemy.position.x >= 0) {
			enemy.velocity.x = -enemy.movementSpeed;
		}
	} else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		enemy.switchSprite("run");
		if (enemy.position.x <= canvas.width - enemy.width - 25) {
			enemy.velocity.x = enemy.movementSpeed;
		}
	} else {
		enemy.switchSprite("idle");
	}

	// jumping
	if (enemy.velocity.y < 0) {
		enemy.switchSprite("jump");
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite("fall");
	}

	// detect player 1 for collision
	if (
		rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
		player.isAttacking &&
		player.framesCurrent === 4
	) {
		const shouldCrit = Math.random() * 100 > 90; // 10% crit chance
		const damage = shouldCrit ? 40 : Math.floor(Math.random() * (35 - 25) + 25);
		enemy.takeHit(damage);
		player.isAttacking = false;
		// document.querySelector("#enemyHealth").style.width = enemy.health + "%";
		// animate health removal
		gsap.to("#enemyHealth", {
			width: enemy.health < 0 ? 0 : enemy.health + "%",
		});
	}

	// if player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
	}

	// detect player 2 / enemy for collision
	if (
		rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
		enemy.isAttacking &&
		enemy.framesCurrent === 2
	) {
		const shouldCrit = Math.random() * 100 > 90; // 10% crit chance
		const damage = shouldCrit ? 30 : Math.floor(Math.random() * (20 - 12) + 12);
		player.takeHit(damage);
		enemy.isAttacking = false;
		// document.querySelector("#playerHealth").style.width = player.health + "%";
		// animate health removal
		gsap.to("#playerHealth", {
			width: player.health < 0 ? 0 : player.health + "%",
		});
	}

	// if enemy misses
	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}

	// end game based on health
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player, enemy, timerId });
	}
}

animate();

window.addEventListener("keydown", event => {
	if (!player.dead) {
		switch (event.key) {
			case "d":
				keys.d.pressed = true;
				player.lastKey = "d";
				break;
			case "a":
				keys.a.pressed = true;
				player.lastKey = "a";
				break;
			case "w":
				if (player.position.y > 329) {
					// Only allow single jump
					player.velocity.y = -15;
				}
				break;
			case " ":
				player.attack("attack1");
				break;
			case "f":
				player.attack("attack2");
				break;
			// case s:
			//   crouch
			//   break;
		}
	}

	if (!enemy.dead) {
		switch (event.key) {
			case "ArrowLeft":
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = "ArrowLeft";
				break;
			case "ArrowRight":
				keys.ArrowRight.pressed = true;
				enemy.lastKey = "ArrowRight";
				break;
			case "ArrowUp":
				if (enemy.position.y > 329) {
					enemy.velocity.y = -15;
				}
				break;
			case "Shift":
				// right shift
				if (event.location === 2) {
					enemy.attack("attack1");
				}
				break;
			case "-":
				enemy.attack("attack2");
				break;

			// case "ArrowDown":
			//   crouch
			//   break;
		}
	}
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
		// case "w":
		//   keys.w.pressed = false;
		//   break;
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
		// case "ArrowUp":
		//   keys.ArrowUp.pressed = false;
		//   break;
		// case "ArrowDown":
		//   keys.ArrowDown.pressed = false;
		//   break;
	}
});

// TODO:
// player sometimes keep running when being hit
// Remove double jump
// responsive to full screen
// prevent running off page
// menu
// block attack
// crouch
// better hitbox with swords
// super attack (attack2)
// music and sound effects
// pause
// save highscore to localstorage
// pick fighter
// fight against ai
// fatality
// moving background, wind in trees
// mock opponent
// change direction when running past each other
