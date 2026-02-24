/**
 * Player - Hoppy el robot héroe.
 * Estados: small, big, star (invencible), dead
 *
 * Física NES-accurate:
 *   - Aceleración gradual al correr, fricción al soltar teclas
 *   - Estado 'skid' (derrape) al cambiar de dirección bruscamente
 *   - Salto variable: soltar rápido = salto corto; mantener = altura máxima
 *   - Coyote time: permite saltar ~100ms después de caer de una plataforma
 *   - Velocidad máxima horizontal clampeada (terminal velocity)
 *   - Animación de caminar sincronizada con la velocidad real
 */
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.state = 'small'; // 'small' | 'big' | 'star' | 'dead'
    this.starTimer      = 0;
    this.starFlashTimer = 0;
    this.invincibleTimer = 0;  // invencibilidad breve tras recibir daño
    this.isDead       = false;
    this.isGrounded   = false;
    this.facingRight  = true;
    this.walkFrame    = 0;
    this.walkTimer    = 0;
    this.jumpPressed  = false;
    this.jumpHeld     = false;

    // ── Coyote time ──────────────────────────────────────────────────────────
    // Permite saltar durante COYOTE_TIME ms después de caer de una plataforma
    this.coyoteTimer  = 0;
    this.COYOTE_TIME  = 100; // ms

    // ── Estado de derrape (skid) ──────────────────────────────────────────────
    // Activo cuando el jugador presiona la dirección contraria a su movimiento
    this.isSkidding   = false;

    // ── Cuerpo físico ─────────────────────────────────────────────────────────
    this.setCollideWorldBounds(false);
    this.body.setMaxVelocityX(320);
    this.body.setMaxVelocityY(700);
    this.setDepth(10);

    this._updateBody();
    this._setupAnimations();
  }

  _setupAnimations() {
    // Sin Phaser anims – intercambiamos texturas manualmente para precisión pixel
  }

  _updateBody() {
    if (this.state === 'big' || this.state === 'star') {
      // Sprite grande: 22×32px. offset(3,6) + altura 26 = 32 → alineado al suelo
      this.body.setSize(16, 26);
      this.body.setOffset(3, 6);
    } else {
      // Sprite pequeño: 18×18px. offset(3,4) + altura 14 = 18 → alineado al suelo
      this.body.setSize(12, 14);
      this.body.setOffset(3, 4);
    }
  }

  grow() {
    if (this.state === 'small') {
      // Guardamos body.bottom antes del cambio para mantener los pies plantados
      const oldBottom = this.body.bottom;

      this.scene.tweens.killTweensOf(this);
      this.setAlpha(1);

      this.state = 'big';
      this._updateBody();

      // Forzamos la textura grande AHORA para que displayHeight (32) sea correcto
      this.setTexture('player_big_idle');

      // Ajustamos y para que body.bottom quede en la misma posición
      this.y = oldBottom - 16;

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
    this.starTimer = 10000; // 10 segundos
    this._updateBody();
  }

  takeDamage() {
    if (this.isDead) return;
    if (this.invincibleTimer > 0) return;
    if (this.state === 'star') return; // invencible

    if (this.state === 'big') {
      this.state = 'small';
      this._updateBody();
      this.invincibleTimer = 2000; // 2s de gracia
      // Flash de daño
      this.scene.tweens.add({
        targets: this,
        alpha: { from: 0.2, to: 1 },
        duration: 100,
        repeat: 8,
        yoyo: true,
        onComplete: () => { if (!this.isDead) this.setAlpha(1); }
      });
    } else {
      this.die();
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.state  = 'dead';
    this.body.setVelocityX(0);
    this.body.setVelocityY(-500);
    this.body.setAllowGravity(true);
    this.setTexture('player_dead');
    window.Sounds && window.Sounds.death();
    this.scene.events.emit('player-died');
  }

  update(time, delta, cursors, wasd, mobileInput) {
    if (this.isDead) {
      this.setFlipX(false);
      return;
    }

    const onGround = this.body.blocked.down;
    this.isGrounded = onGround;

    // ── Coyote time ──────────────────────────────────────────────────────────
    // En suelo: recargamos el timer. En el aire: lo decrementamos
    if (onGround) {
      this.coyoteTimer = this.COYOTE_TIME;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    // ── Timer de estrella ─────────────────────────────────────────────────────
    if (this.state === 'star') {
      this.starTimer      -= delta;
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

    // ── Timer de invencibilidad ───────────────────────────────────────────────
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= delta;
    }

    // ── Input ─────────────────────────────────────────────────────────────────
    const left  = cursors.left.isDown  || (wasd && wasd.left.isDown)  || mobileInput.left;
    const right = cursors.right.isDown || (wasd && wasd.right.isDown) || mobileInput.right;
    const jump  = cursors.up.isDown    || (wasd && wasd.up.isDown)    ||
                  cursors.space.isDown || mobileInput.jump;

    const vx      = this.body.velocity.x;
    const accel   = onGround ? 900 : 600;
    const decel   = onGround ? 1200 : 400;
    const maxSpeed = 220;

    // ── Detección de derrape (skid) ───────────────────────────────────────────
    // Skid: en suelo, presionando la dirección contraria al movimiento actual
    // con suficiente velocidad para que sea visible (>60 px/s)
    this.isSkidding = onGround &&
      ((left && !right && vx > 60) || (right && !left && vx < -60));

    // ── Movimiento horizontal ─────────────────────────────────────────────────
    if (left && !right) {
      this.facingRight = false;
      this.body.setAccelerationX(-accel);
      if (vx > maxSpeed) this.body.setVelocityX(maxSpeed);
    } else if (right && !left) {
      this.facingRight = true;
      this.body.setAccelerationX(accel);
      if (vx < -maxSpeed) this.body.setVelocityX(-maxSpeed);
    } else {
      this.body.setAccelerationX(0);
      // Fricción manual: desaceleración lineal
      if (Math.abs(vx) < 10) {
        this.body.setVelocityX(0);
      } else {
        this.body.setVelocityX(vx - Math.sign(vx) * decel * (delta / 1000));
      }
    }

    // Clamp de velocidad máxima horizontal
    if (this.body.velocity.x >  maxSpeed) this.body.setVelocityX( maxSpeed);
    if (this.body.velocity.x < -maxSpeed) this.body.setVelocityX(-maxSpeed);

    // ── Salto ─────────────────────────────────────────────────────────────────
    // Permitido en suelo O dentro de la ventana de coyote time
    const canJump = onGround || this.coyoteTimer > 0;
    if (jump && !this.jumpPressed && canJump) {
      this.body.setVelocityY(this.isBig() ? -580 : -520);
      this.jumpPressed = true;
      this.jumpHeld    = true;
      this.coyoteTimer = 0; // consumir coyote time
      window.Sounds && window.Sounds.jump();
    }
    if (!jump) {
      this.jumpPressed = false;
      this.jumpHeld    = false;
    }

    // ── Salto variable ────────────────────────────────────────────────────────
    // Soltar el botón temprano corta la velocidad ascendente (delta-independiente)
    if (!jump && this.jumpHeld && this.body.velocity.y < -200) {
      const cutFactor = Math.pow(0.82, delta / 16.67);
      this.body.setVelocityY(this.body.velocity.y * cutFactor);
    }
    if (onGround) this.jumpHeld = false;

    // ── Flip de sprite ────────────────────────────────────────────────────────
    this.setFlipX(!this.facingRight);

    // ── Actualización de textura / animación ──────────────────────────────────
    this._updateTexture(delta, onGround, left || right);
  }

  _updateTexture(delta, onGround, moving) {
    const big  = this.state === 'big';
    const star = this.state === 'star';
    const prefix = (big || star) ? 'player_big' : 'player';
    const vx   = Math.abs(this.body.velocity.x);

    if (!onGround) {
      // ── En el aire: textura de salto ─────────────────────────────────────
      if (star) {
        this.setTexture('player_big_star');
      } else {
        this.setTexture(`${prefix}_jump`);
      }

    } else if (this.isSkidding) {
      // ── Derrape: walk2 con flip contrario al movimiento ──────────────────
      // El personaje "frena" mirando en sentido opuesto a su velocidad (NES style)
      if (star) {
        this.setTexture('player_big_star');
      } else {
        this.setTexture(`${prefix}_walk2`);
        // Override del flip: mirar contra la dirección de movimiento actual
        this.setFlipX(this.body.velocity.x > 0); // moviendose a la derecha → cara a izquierda
      }

    } else if (moving) {
      // ── Caminando: frame rate sincronizado con la velocidad ───────────────
      // A velocidad máxima (220) → ~70ms/frame; en reposo → ~180ms/frame
      const interval = Math.max(70, 180 - vx * 0.5);
      this.walkTimer += delta;
      if (this.walkTimer > interval) {
        this.walkFrame = (this.walkFrame + 1) % 2;
        this.walkTimer = 0;
      }
      if (star) {
        this.setTexture('player_big_star');
      } else {
        this.setTexture(`${prefix}_walk${this.walkFrame + 1}`);
      }

    } else {
      // ── Idle ─────────────────────────────────────────────────────────────
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
