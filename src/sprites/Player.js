/**
 * Player - Hoppy the robot hero
 * States: small, big, star (invincible), dead
 */
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.state = 'small'; // 'small' | 'big' | 'star' | 'dead'
    this.starTimer = 0;
    this.starFlashTimer = 0;
    this.invincibleTimer = 0; // brief invincibility after hit
    this.isDead = false;
    this.isGrounded = false;
    this.facingRight = true;
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.jumpPressed = false;
    this.jumpHeld = false;

    // Physics body
    this.setCollideWorldBounds(false);
    this.body.setMaxVelocityX(320);
    this.body.setMaxVelocityY(700);
    this.setDepth(10);

    this._updateBody();
    this._setupAnimations();
  }

  _setupAnimations() {
    // No Phaser anims – we switch textures manually for pixel precision
  }

  _updateBody() {
    if (this.state === 'big' || this.state === 'star') {
      this.body.setSize(20, 44);
      this.body.setOffset(2, 4);
    } else {
      this.body.setSize(14, 26);
      this.body.setOffset(1, 4);
    }
  }

  grow() {
    if (this.state === 'small') {
      this.state = 'big';
      this._updateBody();
      this.scene.sound && this.scene.sound.play && null; // placeholder
      this.scene.tweens.add({
        targets: this,
        scaleX: { from: 1.3, to: 1 },
        scaleY: { from: 1.3, to: 1 },
        duration: 200,
        ease: 'Power2'
      });
    }
  }

  activateStar() {
    this.state = 'star';
    this.starTimer = 10000; // 10 seconds
    this._updateBody();
  }

  takeDamage() {
    if (this.isDead) return;
    if (this.invincibleTimer > 0) return;
    if (this.state === 'star') return; // invincible

    if (this.state === 'big') {
      this.state = 'small';
      this._updateBody();
      this.invincibleTimer = 2000; // 2s grace
      // Flash effect
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 0.2, to: 1 },
        duration: 100,
        repeat: 8,
        yoyo: true
      });
    } else {
      this.die();
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.state = 'dead';
    this.body.setVelocityX(0);
    this.body.setVelocityY(-500);
    this.body.setAllowGravity(true);
    this.setTexture('player_dead');
    this.scene.events.emit('player-died');
  }

  update(time, delta, cursors, wasd, mobileInput) {
    if (this.isDead) {
      this.setFlipX(false);
      return;
    }

    const onGround = this.body.blocked.down;
    this.isGrounded = onGround;

    // Star timer
    if (this.state === 'star') {
      this.starTimer -= delta;
      this.starFlashTimer -= delta;
      if (this.starFlashTimer <= 0) {
        this.setVisible(!this.visible);
        this.starFlashTimer = 80;
      }
      if (this.starTimer <= 0) {
        this.state = 'big';
        this.setVisible(true);
        this._updateBody();
      }
    } else {
      this.setVisible(true);
    }

    // Invincibility timer
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= delta;
    }

    // Horizontal movement
    const left  = cursors.left.isDown  || (wasd && wasd.left.isDown)  || mobileInput.left;
    const right = cursors.right.isDown || (wasd && wasd.right.isDown) || mobileInput.right;
    const jump  = cursors.up.isDown    || (wasd && wasd.up.isDown)    ||
                  cursors.space.isDown || mobileInput.jump;

    const accel = onGround ? 900 : 600;
    const decel = onGround ? 1200 : 400;
    const maxSpeed = 220;

    if (left && !right) {
      this.facingRight = false;
      this.body.setAccelerationX(-accel);
      if (this.body.velocity.x > maxSpeed) this.body.setVelocityX(maxSpeed);
    } else if (right && !left) {
      this.facingRight = true;
      this.body.setAccelerationX(accel);
      if (this.body.velocity.x < -maxSpeed) this.body.setVelocityX(-maxSpeed);
    } else {
      this.body.setAccelerationX(0);
      // Decelerate
      const vx = this.body.velocity.x;
      if (Math.abs(vx) < 10) {
        this.body.setVelocityX(0);
      } else {
        this.body.setVelocityX(vx - Math.sign(vx) * decel * (delta / 1000));
      }
    }

    // Clamp speed
    if (this.body.velocity.x > maxSpeed)  this.body.setVelocityX(maxSpeed);
    if (this.body.velocity.x < -maxSpeed) this.body.setVelocityX(-maxSpeed);

    // Jump
    if (jump && !this.jumpPressed && onGround) {
      this.body.setVelocityY(-520);
      this.jumpPressed = true;
      this.jumpHeld = true;
    }
    if (!jump) {
      this.jumpPressed = false;
      this.jumpHeld = false;
    }
    // Variable jump height: cut velocity if button released early
    if (!jump && this.jumpHeld && this.body.velocity.y < -200) {
      this.body.setVelocityY(this.body.velocity.y * 0.85);
    }
    if (onGround) this.jumpHeld = false;

    // Flip sprite
    this.setFlipX(!this.facingRight);

    // Update texture
    this._updateTexture(delta, onGround, left || right);
  }

  _updateTexture(delta, onGround, moving) {
    const big = this.state === 'big';
    const star = this.state === 'star';
    const prefix = big || star ? 'player_big' : 'player';
    const suffix  = star ? '_star' : '';

    if (!onGround) {
      this.setTexture(`${prefix}_jump${star ? '' : ''}`);
      if (star) this.setTexture('player_big_star');
    } else if (moving) {
      this.walkTimer += delta;
      if (this.walkTimer > 120) {
        this.walkFrame = (this.walkFrame + 1) % 2;
        this.walkTimer = 0;
      }
      if (star) {
        this.setTexture('player_big_star');
      } else {
        this.setTexture(`${prefix}_walk${this.walkFrame + 1}`);
      }
    } else {
      if (star) {
        this.setTexture('player_big_star');
      } else {
        this.setTexture(`${prefix}_idle`);
      }
    }
  }

  isStar() { return this.state === 'star'; }
  isBig()  { return this.state === 'big' || this.state === 'star'; }
}
