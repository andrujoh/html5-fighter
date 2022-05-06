const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
// canvas.style.backgroundColor = "red";
c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;

    // TODO: not working
    console.log(
      `this.position.y + this.height + this.velocity`,
      this.position.y + this.height + this.velocity.y
    );
    console.log("canvas.height:", canvas.height);
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    }
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: {
    x: 0,
    y: 4,
  },
});

const enemy = new Sprite({
  position: { x: canvas.width - 50, y: 0 },
  velocity: {
    x: 0,
    y: 0,
  },
});

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
}

animate();
