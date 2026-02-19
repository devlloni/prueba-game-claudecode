/**
 * GameScene - Main gameplay scene.
 * Handles level generation, physics, collisions, and all game logic.
 */
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.levelIndex = data.level || 0;
    this.lives      = data.lives !== undefined ? data.lives : 3;
    this.score      = data.score || 0;
    this.coins      = data.coins || 0;
    this.gamePaused = false;
    this.gameOver   = false;
    this.levelDone  = false;
    this.timer      = 400;
    this.timerTick  = 0;
    this.playerDead = false;
    this.deathDelay = 0;
    this.flagTouched = false;
    this.flagSlide   = false;
    this.flagSlideY  = 0;
  }

  create() {
    const ld = LEVELS[this.levelIndex];
    if (!ld) { this.scene.start('WinScene', { score: this.score, coins: this.coins, lives: this.lives }); return; }

    this.ld = ld;
    const W = ld.width, H = 480;

    // ── Physics world ──────────────────────────────────────────────────────────
    this.physics.world.setBounds(0, 0, W, H + 400); // extra height for falling
    this.physics.world.gravity.y = ld.gravity || 800;

    // ── Camera ──────────────────────────────────────────────────────────────────
    this.cameras.main.setBounds(0, 0, W, H);
    this.cameras.main.setBackgroundColor('#4FC3F7');

    // ── Background ──────────────────────────────────────────────────────────────
    this._buildBackground(ld, W, H);

    // ── Static groups ──────────────────────────────────────────────────────────
    this.groundGroup    = this.physics.add.staticGroup();
    this.platformGroup  = this.physics.add.staticGroup();
    this.brickGroup     = this.physics.add.staticGroup();
    this.questionGroup  = this.physics.add.staticGroup();

    // Dynamic groups
    this.enemyGroup     = this.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, runChildUpdate: true });
    this.powerupGroup   = this.physics.add.group();
    this.coinGroup      = this.physics.add.group();

    // ── Build level ─────────────────────────────────────────────────────────────
    this._buildGround(ld);
    this._buildPlatforms(ld);
    this._buildBricks(ld);
    this._buildQuestions(ld);
    this._buildPipes(ld);
    this._buildCoins(ld);
    this._buildDecorations(ld);
    this._buildFlag(ld, H);
    this._spawnEnemies(ld);

    // ── Player ──────────────────────────────────────────────────────────────────
    const ps = ld.playerStart;
    this.player = new Player(this, ps.x, ps.y);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(80, 80);

    // ── Input ───────────────────────────────────────────────────────────────────
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ── Mobile Controls ─────────────────────────────────────────────────────────
    this.mobile = new MobileControls();
    if (this.mobile.isMobile()) {
      this.mobile.create();
      this.mobile.show();
    }

    // ── Colliders ────────────────────────────────────────────────────────────────
    this._setupColliders();

    // ── HUD ─────────────────────────────────────────────────────────────────────
    this.scene.launch('HUDScene', {
      score: this.score,
      coins: this.coins,
      lives: this.lives,
      levelName: `LEVEL ${this.levelIndex+1}: ${ld.name.toUpperCase()}`
    });
    this.hud = this.scene.get('HUDScene');

    // ── Player events ───────────────────────────────────────────────────────────
    this.events.on('player-died', () => this._onPlayerDied(), this);

    // ── Keyboard shortcuts ───────────────────────────────────────────────────────
    this.input.keyboard.on('keydown-P',   () => this.gamePaused ? this.resumeGame() : this.pauseGame());
    this.input.keyboard.on('keydown-ESC', () => this.gamePaused ? this.resumeGame() : this.pauseGame());
  }

  /* ─────────────────── BACKGROUND BUILDER ─────────────────────────────────── */
  _buildBackground(ld, W, H) {
    // Parallax background images (tiled)
    const bgKey = ld.bgKey || 'bg_sky';
    const bgImg = this.add.tileSprite(0, 0, W, H, bgKey).setOrigin(0, 0).setScrollFactor(0.2).setDepth(-10);
    this._bgImg = bgImg;

    // Decorative clouds / hills drawn at creation (pre-decoration layer)
  }

  /* ─────────────────── LEVEL BUILDERS ─────────────────────────────────────── */
  _buildGround(ld) {
    const T = 32;
    const gapSet = new Set((ld.gaps||[]).flatMap(g => {
      const tiles = [];
      for (let x = g.x; x < g.x + g.w; x += T) tiles.push(Math.floor(x/T));
      return tiles;
    }));

    ld.ground.forEach(seg => {
      for (let x = seg.x; x < seg.x + seg.w; x += T) {
        const tx = Math.floor(x/T);
        if (gapSet.has(tx)) continue;
        // Two ground tiles stacked
        [seg.y, seg.y + T].forEach(y => {
          const tile = this.groundGroup.create(x + T/2, y + T/2, ld.groundTile);
          tile.setImmovable(true);
          tile.body.setSize(T, T);
          tile.refreshBody();
        });
      }
    });
  }

  _buildPlatforms(ld) {
    const T = 32;
    (ld.platforms || []).forEach(p => {
      for (let i = 0; i < p.w; i++) {
        const tile = this.platformGroup.create(p.x + T/2 + i*T, p.y + 8, 'tile_platform');
        tile.setImmovable(true);
        tile.body.setSize(T, 16);
        tile.refreshBody();
      }
    });
  }

  _buildBricks(ld) {
    const T = 32;
    (ld.bricks || []).forEach(b => {
      const brick = this.brickGroup.create(b.x + T/2, b.y + T/2, 'tile_brick');
      brick.setImmovable(true);
      brick.body.setSize(T, T);
      brick.refreshBody();
      brick.isBrick = true;
    });
  }

  _buildQuestions(ld) {
    const T = 32;
    (ld.questions || []).forEach(q => {
      const qb = this.questionGroup.create(q.x + T/2, q.y + T/2, 'tile_question');
      qb.setImmovable(true);
      qb.body.setSize(T, T);
      qb.refreshBody();
      qb.isQuestion = true;
      qb.item = q.item || 'coin';
      qb.used = false;
    });
  }

  _buildPipes(ld) {
    const T = 32;
    (ld.pipes || []).forEach(p => {
      const GY = 416;
      // Body
      for (let i = 1; i < p.h; i++) {
        const y = GY - i * T;
        const body = this.groundGroup.create(p.x + 20, y + T/2, 'pipe_body');
        body.setImmovable(true);
        body.body.setSize(32, T);
        body.refreshBody();
      }
      // Top cap
      const topY = GY - p.h * T;
      const top = this.groundGroup.create(p.x + 20, topY + 16, 'pipe_top');
      top.setImmovable(true);
      top.body.setSize(40, 32);
      top.refreshBody();
    });
  }

  _buildCoins(ld) {
    (ld.coins || []).forEach(c => {
      const coin = this.coinGroup.create(c.x + 8, c.y, 'coin');
      coin.body.setAllowGravity(false);
      coin.body.setImmovable(true);
      // Gentle bob
      this.tweens.add({
        targets: coin, y: c.y - 6,
        duration: 700 + Math.random()*300,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    });
  }

  _buildDecorations(ld) {
    (ld.decorations || []).forEach(d => {
      const key = d.type === 'hill' ? 'hill' : d.type === 'bush' ? 'bush' :
                  d.type === 'cloud' ? 'cloud' : d.type === 'cave_rock' ? 'cave_rock' : null;
      if (!key) return;
      const img = this.add.image(d.x, d.y, key).setDepth(-1);
      if (d.type === 'cloud') img.setScrollFactor(0.5);
    });
  }

  _buildFlag(ld, H) {
    const fx = ld.flagX;
    const poleH = 320;
    const poleY = H - 64 - poleH / 2; // top of pole
    this.flagPole = this.add.image(fx, H - 64, 'flag_pole')
      .setOrigin(0.5, 1).setDepth(2);
    this.flagImage = this.add.image(fx + 4, H - 64 - poleH + 20, 'flag')
      .setOrigin(0, 0.5).setDepth(3);
    this.flagTopY = H - 64 - poleH + 20;
    this.flagX    = fx;

    // Castle
    if (ld.castleX) {
      this.add.image(ld.castleX + 48, H - 64, 'castle').setOrigin(0.5, 1).setDepth(1);
    }

    // Trigger zone for flag
    this.flagZone = this.add.zone(fx + 8, poleY, 32, poleH).setOrigin(0.5, 0);
    this.physics.world.enable(this.flagZone);
    this.flagZone.body.setAllowGravity(false);
    this.flagZone.body.setImmovable(true);
  }

  _spawnEnemies(ld) {
    (ld.enemies || []).forEach(e => {
      const enemy = createEnemy(this, e);
      this.enemyGroup.add(enemy);
      // Give enemy colliders after adding
      this.physics.add.collider(enemy, this.groundGroup);
      this.physics.add.collider(enemy, this.platformGroup);
    });
  }

  /* ─────────────────── COLLIDERS ─────────────────────────────────────────── */
  _setupColliders() {
    const pl = this.player;

    // Player ↔ ground
    this.physics.add.collider(pl, this.groundGroup);
    // One-way platform: only block player when falling downward
    this.physics.add.collider(pl, this.platformGroup, null, (p, _plat) => {
      return p.body.velocity.y >= 0;
    }, this);

    // Player ↔ bricks (head bump)
    this.physics.add.collider(pl, this.brickGroup, this._onBrickHit, null, this);

    // Player ↔ question blocks (head bump)
    this.physics.add.collider(pl, this.questionGroup, this._onQuestionHit, null, this);

    // Player ↔ enemies
    this.physics.add.overlap(pl, this.enemyGroup, this._onPlayerEnemyOverlap, null, this);

    // Player ↔ power-ups
    this.physics.add.overlap(pl, this.powerupGroup, this._onPowerupCollect, null, this);

    // Player ↔ coins
    this.physics.add.overlap(pl, this.coinGroup, this._onCoinCollect, null, this);

    // Player ↔ flag
    this.physics.add.overlap(pl, this.flagZone, this._onFlagTouch, null, this);

    // Enemies ↔ shells
    this.physics.add.collider(this.enemyGroup, this.enemyGroup, this._onEnemyShellHit, null, this);

    // Power-ups ↔ ground
    this.physics.add.collider(this.powerupGroup, this.groundGroup);
    this.physics.add.collider(this.powerupGroup, this.platformGroup);
    this.physics.add.collider(this.powerupGroup, this.brickGroup);
  }

  /* ─────────────────── COLLISION CALLBACKS ─────────────────────────────────── */
  _onBrickHit(player, brick) {
    // Only when hitting from below
    if (player.body.velocity.y >= 0) return;
    if (player.isBig()) {
      // Break the brick
      this._breakBrick(brick);
    } else {
      // Bounce brick
      this._bounceTile(brick);
    }
  }

  _breakBrick(brick) {
    // Particle fragments
    for (let i = 0; i < 6; i++) {
      const frag = this.add.image(brick.x, brick.y, 'brick_frag');
      this.physics.add.existing(frag);
      frag.body.setVelocity(
        Phaser.Math.Between(-200, 200),
        Phaser.Math.Between(-400, -150)
      );
      frag.body.setGravityY(400);
      this.time.delayedCall(1000, () => frag.destroy());
    }
    this._addScore(50);
    brick.destroy();
  }

  _bounceTile(tile) {
    // Brief upward tween
    this.tweens.add({
      targets: tile,
      y: tile.y - 8,
      duration: 80,
      yoyo: true,
      onComplete: () => tile.refreshBody()
    });
  }

  _onQuestionHit(player, qblock) {
    if (qblock.used) return;
    if (player.body.velocity.y >= 0) return;

    qblock.used = true;
    qblock.setTexture('tile_empty');
    qblock.refreshBody();
    this._bounceTile(qblock);

    // Spawn item
    this._spawnItem(qblock.x, qblock.y, qblock.item);
  }

  _spawnItem(x, y, type) {
    if (type === 'coin') {
      // Pop-up coin animation
      const coin = new PowerUp(this, x, y - 16, 'coin');
      this.powerupGroup.add(coin);
      this._addScore(200);
      this._addCoins(1);
    } else {
      const pu = new PowerUp(this, x, y - 24, type);
      this.powerupGroup.add(pu);
      this.physics.add.collider(pu, this.groundGroup);
      this.physics.add.collider(pu, this.platformGroup);
    }
  }

  _onPowerupCollect(player, pu) {
    if (pu.collected) return;
    pu.collected = true;

    switch (pu.powerType) {
      case 'mushroom':
        player.grow();
        this._addScore(1000);
        this._showScorePopup(player.x, player.y - 30, '+1000');
        break;
      case 'star':
        player.activateStar();
        this._addScore(1000);
        this._showScorePopup(player.x, player.y - 30, 'STAR!');
        break;
      case 'flower':
        player.grow();
        this._addScore(1000);
        this._showScorePopup(player.x, player.y - 30, '+1000');
        break;
      case 'coin':
        this._addCoins(1);
        this._addScore(200);
        break;
    }

    // Collect flash
    this.tweens.add({
      targets: pu, alpha: 0, scaleX: 2, scaleY: 2,
      duration: 200, onComplete: () => pu.destroy()
    });
  }

  _onCoinCollect(player, coin) {
    this._addCoins(1);
    this._addScore(100);
    // Particle
    const particle = this.add.image(coin.x, coin.y, 'particle_coin');
    this.tweens.add({
      targets: particle, y: coin.y - 50, alpha: 0, duration: 400,
      onComplete: () => particle.destroy()
    });
    coin.destroy();
  }

  _onPlayerEnemyOverlap(player, enemy) {
    if (player.isDead || enemy.isDead) return;

    const pBottom = player.y + player.body.height / 2;
    const eTop    = enemy.y - enemy.body.height / 2;

    // Stomp check: player falling onto enemy top
    if (player.body.velocity.y > 0 && pBottom <= eTop + 20 && player.y < enemy.y) {
      // Player stomps enemy
      const pts = enemy.points || 100;

      if (enemy instanceof Shellie && enemy.shellMode && !enemy.isDead) {
        // Kick the shell if stopped, or stomp if moving shell
        if (Math.abs(enemy.body.velocity.x) > 10) {
          enemy.stompShell();
          this._addScore(pts * 5);
        } else {
          enemy.onStomp();
        }
      } else {
        enemy.stomp();
        this._addScore(pts);
        this._showScorePopup(enemy.x, enemy.y - 20, '+' + pts);
      }

      // Bounce player
      player.body.setVelocityY(-300);
      if (player.jumpHeld) player.body.setVelocityY(-420);

    } else {
      // Side hit – player takes damage
      if (player.isStar()) {
        // Star player kills enemy
        enemy.kill();
        this._addScore(enemy.points * 2);
        this._showScorePopup(enemy.x, enemy.y - 20, '+' + enemy.points * 2);
      } else {
        player.takeDamage();
      }
    }
  }

  _onEnemyShellHit(e1, e2) {
    // Moving shell kills other enemies
    const shell = (e1 instanceof Shellie && e1.shellMode && Math.abs(e1.body.velocity.x) > 10) ? e1
                : (e2 instanceof Shellie && e2.shellMode && Math.abs(e2.body.velocity.x) > 10) ? e2 : null;
    const victim = shell === e1 ? e2 : e1;
    if (shell && victim && !victim.isDead) {
      victim.kill();
      this._addScore(victim.points * 2);
    }
  }

  _onFlagTouch(player, _zone) {
    if (this.flagTouched || player.isDead) return;
    this.flagTouched = true;
    this.flagSlide   = true;

    // Slide flag down
    this.flagSlideY = this.flagImage.y;
    const targetY = this.scale.height - 64 - 12;

    // Player latches on pole and slides down
    player.body.setVelocity(0, 0);
    player.body.setAllowGravity(false);
    player.setX(this.flagX + 16);

    // Calculate score bonus from time remaining
    const timeBonus = Math.floor(this.timer) * 50;
    this._addScore(timeBonus + 5000);

    this.tweens.add({
      targets: this.flagImage,
      y: targetY,
      duration: 800,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: player,
      y: targetY,
      duration: 800,
      ease: 'Linear',
      onComplete: () => {
        // Move player off the pole
        player.setX(this.flagX + 50);
        player.body.setAllowGravity(true);
        this._levelComplete();
      }
    });
  }

  /* ─────────────────── PLAYER DEATH ─────────────────────────────────────── */
  _onPlayerDied() {
    this.playerDead = true;
    this.deathDelay = 2000;
    this.mobile && this.mobile.reset();

    // Camera shake
    this.cameras.main.shake(300, 0.02);
  }

  _respawnOrGameOver() {
    this.lives--;
    this.events.emit('lives-update', this.lives);

    if (this.lives <= 0) {
      this.scene.stop('HUDScene');
      this.mobile && this.mobile.destroy();
      this.scene.start('GameOverScene', {
        level: this.levelIndex, score: this.score, coins: this.coins
      });
    } else {
      // Restart current level
      this.scene.stop('HUDScene');
      this.mobile && this.mobile.destroy();
      this.scene.restart({ level: this.levelIndex, lives: this.lives, score: this.score, coins: this.coins });
    }
  }

  /* ─────────────────── LEVEL COMPLETE ────────────────────────────────────── */
  _levelComplete() {
    if (this.levelDone) return;
    this.levelDone = true;

    this.time.delayedCall(1000, () => {
      this.scene.stop('HUDScene');
      this.mobile && this.mobile.destroy();
      this.scene.start('LevelCompleteScene', {
        level:     this.levelIndex,
        nextLevel: this.levelIndex + 1,
        score:     this.score,
        coins:     this.coins,
        lives:     this.lives
      });
    });
  }

  /* ─────────────────── SCORE / COINS ─────────────────────────────────────── */
  _addScore(pts) {
    this.score += pts;
    this.events.emit('score-update', this.score);
  }

  _addCoins(n) {
    this.coins += n;
    if (this.coins % 100 === 0) { // 100 coins = extra life
      this.lives++;
      this.events.emit('lives-update', this.lives);
    }
    this.events.emit('coin-update', this.coins);
  }

  _showScorePopup(x, y, text) {
    const t = this.add.text(x, y, text, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '9px', color: '#FFD700',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({
      targets: t, y: y - 40, alpha: 0, duration: 800,
      ease: 'Power2', onComplete: () => t.destroy()
    });
  }

  /* ─────────────────── PAUSE ───────────────────────────────────────────────── */
  pauseGame() {
    if (this.levelDone || this.playerDead) return;
    this.gamePaused = true;
    this.physics.pause();
    this.tweens.pauseAll();
    this.events.emit('paused');
  }

  resumeGame() {
    this.gamePaused = false;
    this.physics.resume();
    this.tweens.resumeAll();
    this.events.emit('resumed');
  }

  /* ─────────────────── UPDATE ─────────────────────────────────────────────── */
  update(time, delta) {
    if (this.gamePaused || this.levelDone) return;

    const pl = this.player;

    // ── Timer ──────────────────────────────────────────────────────────────────
    if (!this.playerDead && !this.flagTouched) {
      this.timerTick += delta;
      if (this.timerTick >= 400) {
        this.timerTick = 0;
        this.timer = Math.max(0, this.timer - 1);
        this.events.emit('time-update', this.timer);
        if (this.timer <= 0) {
          pl.die();
        }
      }
    }

    // ── Death delay ────────────────────────────────────────────────────────────
    if (this.playerDead) {
      this.deathDelay -= delta;
      if (this.deathDelay <= 0) {
        this._respawnOrGameOver();
      }
      return;
    }

    // ── Player update ──────────────────────────────────────────────────────────
    if (!this.flagTouched) {
      pl.update(time, delta, this.cursors, this.wasd, this.mobile);
    }

    // ── Fall into gaps / off-screen death ──────────────────────────────────────
    if (pl.y > this.scale.height + 64) {
      pl.die();
    }

    // ── Enemy edge detection (turn at ledge) ───────────────────────────────────
    this.enemyGroup.children.iterate(e => {
      if (!e || e.isDead || !e.body) return;
      if (e instanceof Batling) return; // Batlings don't walk on ground

      // Check in front of enemy
      if (e.body.blocked.down) {
        const ahead = e.x + e.dir * (e.body.width / 2 + 8);
        // Simple: if near a gap (no ground below ahead), turn
        const tile = this.groundGroup.children.entries.find(t =>
          Math.abs(t.x - ahead) < 24 && t.y > e.y && t.y < e.y + 60
        );
        if (!tile) {
          e.dir *= -1;
          e.setFlipX(e.dir > 0);
        }
      }
    });

    // ── Background parallax ────────────────────────────────────────────────────
    if (this._bgImg) {
      this._bgImg.tilePositionX = this.cameras.main.scrollX * 0.2;
    }
  }
}
