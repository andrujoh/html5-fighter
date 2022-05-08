class Sprite {
  static defaultHeight = 150;

  constructor({ position, imageSrc }) {
    this.position = position;
    this.width = 50;
    this.height = Sprite.defaultHeight;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      canvas.width,
      canvas.height
    );
  }

  update() {
    this.draw();
  }
}

class Fighter {
  static defaultHeight = 150;

  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = Sprite.defaultHeight;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;

    this.movementSpeed = 5;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;

    // Handle gravity

    this.position.y += this.velocity.y;

    // Stop at ground
    const isAtGround =
      this.position.y + this.height + this.velocity.y >= canvas.height * 0.835; // get ground level responsive
    if (isAtGround) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
