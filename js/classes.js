class Sprite {
	static defaultHeight = 150;

	constructor({
		position,
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset = { x: 0, y: 0 },
	}) {
		this.position = position;
		this.width = 50;
		this.height = Sprite.defaultHeight;
		this.image = new Image();
		this.image.src = imageSrc;
		this.scale = scale;
		this.framesMax = framesMax;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 10;
		this.offset = offset;
	}

	draw() {
		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width / this.framesMax), // source image x axis = current frame starting at 0 times width of image divided by framesMax
			0,
			this.image.width / this.framesMax, // image width divided by number of frames
			this.image.height,

			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.image.width / this.framesMax) * this.scale, // image width divided by number of frames
			this.image.height * this.scale
			// canvas.width,
			// canvas.height
		);
	}

	animateFrames() {
		// Run animation on every 10th frame
		this.framesElapsed++;
		if (this.framesElapsed % this.framesHold === 0) {
			// animate shop and go back to first frame when it reaches the end
			if (this.framesCurrent < this.framesMax - 1) {
				this.framesCurrent++;
			} else {
				this.framesCurrent = 0;
			}
		}
	}

	update() {
		this.draw();
		this.animateFrames();
	}
}

class Fighter extends Sprite {
	static defaultHeight = 150;

	constructor({
		position,
		velocity,
		color = "red",
		imageSrc,
		scale = 1,
		framesMax = 1,
		offset = { x: 0, y: 0 },
		sprites,
		attackBox = {
			offset: {},
			width: undefined,
			height: undefined,
		},
	}) {
		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset,
		});

		this.velocity = velocity;
		this.width = 50;
		this.height = Sprite.defaultHeight;
		this.lastKey;
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset: attackBox.offset,
			width: attackBox.width,
			height: attackBox.height,
		};
		this.color = color;
		this.isAttacking;
		this.health = 100;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 10;
		this.movementSpeed = 8;
		this.sprites = sprites;
		this.dead = false;

		for (const sprite in this.sprites) {
			const element = sprites[sprite];
			element.image = new Image();
			element.image.src = element.imageSrc;
		}
	}

	// draw() {
	//   c.fillStyle = this.color;
	//   c.fillRect(this.position.x, this.position.y, this.width, this.height);

	//   // attack box
	//   if (this.isAttacking) {
	//     c.fillStyle = "green";
	//     c.fillRect(
	//       this.attackBox.position.x,
	//       this.attackBox.position.y,
	//       this.attackBox.width,
	//       this.attackBox.height
	//     );
	//   }
	// }

	update() {
		this.draw();
		if (!this.dead) {
			this.animateFrames();
		}

		// attack boxes
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

		// draw the attack box (for tweaking and debugging)
		// c.fillRect(
		//   this.attackBox.position.x,
		//   this.attackBox.position.y,
		//   this.attackBox.width,
		//   this.attackBox.height
		// );

		this.position.x += this.velocity.x;

		// Handle gravity

		this.position.y += this.velocity.y;

		if (
			this.position.y + this.height + this.velocity.y >=
			// canvas.height * 0.835 // get ground level responsive
			canvas.height - 96 // get ground level responsive
		) {
			this.velocity.y = 0;
			this.position.y = 330; // ground level. Thought this would be canvas.height * 0.835
		} else {
			this.velocity.y += gravity;
		}
	}

	attack(type) {
		this.switchSprite(type);
		this.isAttacking = true;
		// setTimeout(() => {
		// this.isAttacking = false;
		// }, 100);
	}

	takeHit(points) {
		this.health -= points;

		if (this.health <= 0) {
			this.switchSprite("death");
		} else {
			this.switchSprite("takeHit");
		}
	}

	switchSprite(sprite) {
		// if player dies
		if (this.image === this.sprites.death.image) {
			if (this.framesCurrent === this.sprites.death.framesMax - 1) {
				this.dead = true;
			}
			return;
			// must return in outermost if
		}
		// overriding all other animations with the attack animation
		if (
			[this.sprites.attack1.image, this.sprites.attack2.image].includes(
				this.image
			) &&
			(this.framesCurrent < this.sprites.attack1.framesMax - 1 ||
				this.frameCurrent < this.sprites.attack2.framesMax - 1)
		) {
			return;
		}
		// override when fighter gets hit
		if (
			this.image === this.sprites.takeHit.image &&
			this.framesCurrent < this.sprites.takeHit.framesMax - 1
		) {
			return;
		}
		switch (sprite) {
			case "idle":
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure idle animation starts at 0
				}
				break;
			case "run":
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure run animation starts at 0
				}
				break;
			case "jump":
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure jump animation starts at 0
				}
				break;
			case "fall":
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image;
					this.framesMax = this.sprites.fall.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure fall animation starts at 0
				}
				break;
			case "attack1":
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image;
					this.framesMax = this.sprites.attack1.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure attack 1 animation starts at 0
				}
				break;
			case "attack2":
				if (this.image !== this.sprites.attack2.image) {
					this.image = this.sprites.attack2.image;
					this.framesMax = this.sprites.attack2.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure attack 2 animation starts at 0
				}
				break;
			case "takeHit":
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image;
					this.framesMax = this.sprites.takeHit.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure attack 2 animation starts at 0
				}
				break;
			case "death":
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image;
					this.framesMax = this.sprites.death.framesMax;
					this.framesCurrent = 0; // reset current frame to make sure attack 2 animation starts at 0
				}
				break;
		}
	}
}
