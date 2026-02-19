/**
 * Enemy base class + concrete enemies:
 *  - Gloop  : slime, walks on ground, turns at edges
 *  - Shellie: crab, walks, stomped → shell mode
 *  - Batling: bat, flies in sine wave pattern
 */

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, type) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.enemyType = type;
    this.isDead = false;
    this.isStomped = false;
    this.dir = -1;
    this.speed = 80;
    this.walkTimer = 0;
    this.walkFrame = 0;
    this.points = 100;
    this.setDepth(5);
    this.body.setAllowGravity(true);
  }

  setDirection(dir) {
    this.dir = dir;
    this.setFlipX(dir > 0);
  }

  updateWalkAnim(delta, frame1, frame2, interval = 300) {
    this.walkTimer += delta;
    if (this.walkTimer > interval) {
      this.walkFrame = (this.walkFrame + 1) % 2;
      this.walkTimer = 0;
      this.setTexture(this.walkFrame === 0 ? frame1 : frame2);
    }
  }

  // Called when player stomps on top of this enemy
  stomp() {
    if (this.isDead) return;
    this.isDead = true;
    this.isStomped = true;
    this.body.setVelocityX(0);
    this.body.setAllowGravity(false);
    this.body.setVelocity(0, 0);
    this.onStomp();
  }

  // Called when player (star) hits sideways or when shell hits
  kill() {
    if (this.isDead) return;
    this.isDead = true;
    this.body.setVelocityX(this.dir * 150);
    this.body.setVelocityY(-300);
    this.setFlipY(true);
    this.scene.time.delayedCall(1500, () => this.destroy());
  }

  onStomp() {} // override in subclass

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.isDead) this.move(delta);
  }

  move(delta) {} // override in subclass
}

/* ====================== GLOOP ====================== */
class Gloop extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'gloop_walk1', 'gloop');
    this.speed = 70;
    this.points = 100;
    this.body.setSize(12, 12);
    this.body.setOffset(2, 4);
  }

  move(delta) {
    if (this.isDead) return;

    // Turn at edges
    if (this.body.blocked.right) this.dir = -1;
    if (this.body.blocked.left)  this.dir =  1;

    // Turn at platform edges (don't walk off)
    if (this.body.blocked.down) {
      // Check if next tile is empty (rough edge detection)
      const checkX = this.x + this.dir * (this.width / 2 + 8);
      const checkY = this.y + this.height / 2 + 4;
      // We rely on blocked walls as primary turn signal; edge detection via tiles is handled in scene
    }

    this.body.setVelocityX(this.dir * this.speed);
    this.setFlipX(this.dir > 0);
    this.updateWalkAnim(delta, 'gloop_walk1', 'gloop_walk2', 250);
  }

  onStomp() {
    this.setTexture('gloop_flat');
    this.body.setSize(14, 6);
    this.body.setOffset(1, 10);
    // Remove after brief squish
    this.scene.time.delayedCall(400, () => this.destroy());
  }
}

/* ====================== SHELLIE ====================== */
class Shellie extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'shellie_walk1', 'shellie');
    this.speed = 80;
    this.points = 200;
    this.shellMode = false;
    this.shellKickTimer = 0;
    this.shellSpeed = 380;
    this.body.setSize(14, 14);
    this.body.setOffset(1, 2);
  }

  move(delta) {
    if (this.isDead) return;

    if (this.shellMode) {
      // Shell sliding
      if (this.body.blocked.right) { this.dir = -1; }
      if (this.body.blocked.left)  { this.dir =  1; }
      this.body.setVelocityX(this.dir * this.shellSpeed);

      // Shell kills grounded enemies it hits
      if (this.shellKickTimer > 0) {
        this.shellKickTimer -= delta;
      }
      return;
    }

    if (this.body.blocked.right) this.dir = -1;
    if (this.body.blocked.left)  this.dir =  1;
    this.body.setVelocityX(this.dir * this.speed);
    this.setFlipX(this.dir > 0);
    this.updateWalkAnim(delta, 'shellie_walk1', 'shellie_walk2', 280);
  }

  onStomp() {
    if (!this.shellMode) {
      // Enter shell mode
      this.shellMode = true;
      this.setTexture('shellie_shell');
      this.body.setVelocityX(0);
      this.isDead = false; // not dead yet, just in shell
      this.isStomped = false;
      this.body.setSize(12, 12);
      this.body.setOffset(2, 4);
    } else {
      // Shell is already stopped – kick it
      this.kickShell();
    }
  }

  kickShell() {
    // Player is to the left → shell goes right, vice versa
    const player = this.scene.player;
    if (!player) return;
    this.dir = player.x < this.x ? 1 : -1;
    this.shellKickTimer = 200;
    this.isDead = false;
  }

  isShell() { return this.shellMode && this.body.velocity.x !== 0; }

  // Extra stomp on moving shell -> kill it
  stompShell() {
    this.isDead = true;
    this.body.setVelocity(0, 0);
    this.body.setAllowGravity(false);
    this.setFlipY(true);
    this.scene.time.delayedCall(500, () => this.destroy());
  }
}

/* ====================== BATLING ====================== */
class Batling extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'batling_walk1', 'batling');
    this.speed = 90;
    this.points = 300;
    this.startY = y;
    this.sineTime = Math.random() * Math.PI * 2;
    this.body.setAllowGravity(false);
    this.body.setSize(14, 10);
    this.body.setOffset(1, 3);
  }

  move(delta) {
    if (this.isDead) return;

    if (this.body.blocked.right) this.dir = -1;
    if (this.body.blocked.left)  this.dir =  1;

    this.body.setVelocityX(this.dir * this.speed);
    this.sineTime += delta * 0.003;
    const newY = this.startY + Math.sin(this.sineTime) * 60;
    this.body.setVelocityY((newY - this.y) * 5);

    this.setFlipX(this.dir > 0);
    this.updateWalkAnim(delta, 'batling_walk1', 'batling_walk2', 200);
  }

  onStomp() {
    this.body.setAllowGravity(true);
    this.setFlipY(true);
    this.body.setVelocityY(-250);
    this.setTexture('batling_walk2');
    this.scene.time.delayedCall(800, () => this.destroy());
  }

  kill() {
    if (this.isDead) return;
    this.isDead = true;
    this.body.setAllowGravity(true);
    this.body.setVelocityX(this.dir * 120);
    this.body.setVelocityY(-250);
    this.setFlipY(true);
    this.scene.time.delayedCall(1500, () => this.destroy());
  }
}

/* ====================== FACTORY ====================== */
function createEnemy(scene, data) {
  let enemy;
  switch (data.type) {
    case 'gloop':   enemy = new Gloop(scene,   data.x, data.y); break;
    case 'shellie': enemy = new Shellie(scene, data.x, data.y); break;
    case 'batling': enemy = new Batling(scene, data.x, data.y); break;
    default:        enemy = new Gloop(scene,   data.x, data.y);
  }
  enemy.setDirection(data.dir || -1);
  return enemy;
}
