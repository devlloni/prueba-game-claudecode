/**
 * MenuScene - Main menu with title, start button, and controls info.
 */
class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const { width, height } = this.scale;

    // Gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a4e, 0x1a1a4e, 0x0d4a8a, 0x0d4a8a, 1);
    bg.fillRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height * 0.6);
      const r = Math.random() < 0.3 ? 2 : 1;
      const star = this.add.circle(x, y, r, 0xffffff, Math.random() * 0.6 + 0.4);
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 1000)
      });
    }

    // Ground strip
    const ground = this.add.graphics();
    ground.fillStyle(0x2E7D32);
    ground.fillRect(0, height - 80, width, 80);
    ground.fillStyle(0x1B5E20);
    ground.fillRect(0, height - 80, width, 12);

    // Animated player character on ground
    const playerSprite = this.add.image(width * 0.15, height - 96, 'player_idle')
      .setScale(2).setDepth(5);
    let walkF = 0;
    let walkT = 0;
    this.events.on('update', (t, d) => {
      walkT += d;
      if (walkT > 150) { walkT = 0; walkF = (walkF+1)%2; }
      playerSprite.setTexture(walkF === 0 ? 'player_walk1' : 'player_walk2');
    });

    // Enemy decorations
    const gloop = this.add.image(width * 0.8, height - 90, 'gloop_walk1').setScale(2);
    let ef = 0, et = 0;
    this.events.on('update', (t, d) => {
      et += d; if (et > 250) { et=0; ef=(ef+1)%2; gloop.setTexture(ef===0?'gloop_walk1':'gloop_walk2'); }
    });

    // Cloud decorations
    this.add.image(100, 60, 'cloud').setAlpha(0.9);
    this.add.image(400, 80, 'cloud').setAlpha(0.8);
    this.add.image(650, 50, 'cloud').setAlpha(0.9);

    // ========= TITLE =========
    // Shadow
    this.add.text(width/2 + 4, height*0.18 + 4, 'PIXEL HOP', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '48px', color: '#000033', alpha: 0.5
    }).setOrigin(0.5).setAlpha(0.5);

    const title = this.add.text(width/2, height*0.18, 'PIXEL HOP', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '48px',
      color: '#FFD700',
      stroke: '#CC8800', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width/2, height*0.28, 'ADVENTURE', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '22px',
      color: '#88CCFF',
      stroke: '#0044AA', strokeThickness: 3,
    }).setOrigin(0.5);

    // Bounce title
    this.tweens.add({
      targets: title,
      y: height*0.18 - 8,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // ========= BUTTONS =========
    const btnY = height * 0.52;
    this._makeButton(width/2, btnY,       '▶  START GAME', () => this.startGame(0));
    this._makeButton(width/2, btnY + 72,  '☆  HOW TO PLAY', () => this.showHelp());

    // ========= CONTROLS INFO =========
    const ctrlY = height * 0.72;
    this.add.text(width/2, ctrlY, '🎮 CONTROLS', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#FFDD44'
    }).setOrigin(0.5);

    const controls = [
      '← → / A D : Move',
      '↑ / W / SPACE : Jump',
      'P : Pause',
    ];
    controls.forEach((txt, i) => {
      this.add.text(width/2, ctrlY + 22 + i*18, txt, {
        fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: '#CCCCCC'
      }).setOrigin(0.5);
    });

    // Mobile note
    this.add.text(width/2, height - 30, 'Mobile: Virtual D-Pad appears on touch devices', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '6px', color: '#888888'
    }).setOrigin(0.5);

    // ========= COIN RAIN =========
    this._spawnCoinRain();

    // ESC / any key hint
    this.input.keyboard.on('keydown-ENTER', () => this.startGame(0));
    this.input.keyboard.on('keydown-SPACE', () => this.startGame(0));
  }

  _makeButton(x, y, label, cb) {
    const bg = this.add.graphics();
    const bw = 260, bh = 50;
    bg.fillStyle(0x1565C0, 1);
    bg.fillRoundedRect(x - bw/2, y - bh/2, bw, bh, 10);
    bg.fillStyle(0x42A5F5, 0.3);
    bg.fillRect(x - bw/2 + 4, y - bh/2 + 4, bw - 8, 6);

    const text = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px', color: '#FFFFFF',
    }).setOrigin(0.5);

    // Hit area
    const zone = this.add.zone(x, y, bw, bh).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => { bg.clear(); bg.fillStyle(0x1976D2); bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 10); });
    zone.on('pointerout',  () => { bg.clear(); bg.fillStyle(0x1565C0); bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 10); bg.fillStyle(0x42A5F5,0.3); bg.fillRect(x-bw/2+4, y-bh/2+4, bw-8, 6); });
    zone.on('pointerdown', () => { this.tweens.add({ targets: [bg, text], scaleX: 0.96, scaleY: 0.96, duration: 60, yoyo: true, onComplete: cb }); });
  }

  _spawnCoinRain() {
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(20, this.scale.width - 20);
        const coin = this.add.image(x, -20, 'coin').setAlpha(0.7);
        this.tweens.add({
          targets: coin,
          y: this.scale.height + 20,
          duration: Phaser.Math.Between(2000, 4000),
          ease: 'Linear',
          onComplete: () => coin.destroy()
        });
      }
    });
  }

  showHelp() {
    const { width, height } = this.scale;
    const overlay = this.add.graphics().setDepth(20);
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, width, height);

    const panel = this.add.graphics().setDepth(21);
    panel.fillStyle(0x1a1a4e, 1);
    panel.fillRoundedRect(width/2-200, height/2-180, 400, 360, 16);
    panel.fillStyle(0x3333aa, 1);
    panel.fillRect(width/2-200, height/2-180, 400, 40);

    const title = this.add.text(width/2, height/2-160, 'HOW TO PLAY', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '12px', color: '#FFD700'
    }).setOrigin(0.5).setDepth(22);

    const helpLines = [
      '',
      '• Walk left/right with arrow keys',
      '  or A/D',
      '• Jump with ↑, W or SPACE',
      '• Stomp enemies from above',
      '  to defeat them!',
      '• Hit ? blocks from below',
      '  for power-ups & coins',
      '• Big Hoppy can break bricks!',
      '',
      '★ MUSHROOM → Grow big',
      '★ STAR → Invincibility!',
      '',
      '• Reach the FLAG to win!',
    ];

    helpLines.forEach((line, i) => {
      this.add.text(width/2 - 170, height/2 - 130 + i*16, line, {
        fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: '#CCCCCC'
      }).setDepth(22);
    });

    const closeBtn = this.add.text(width/2, height/2 + 165, '[ CLOSE ]', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#FFD700'
    }).setOrigin(0.5).setDepth(22).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      [overlay, panel, title, closeBtn].forEach(o => o.destroy());
      this.children.list.filter(c => c.depth === 22).forEach(c => c.destroy());
    });
  }

  startGame(level) {
    this.scene.start('GameScene', { level: level || 0, lives: 3, score: 0, coins: 0 });
  }
}
