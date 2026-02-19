/**
 * GameOverScene - Shown when player loses all lives.
 */
class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  create(data) {
    const { width, height } = this.scale;
    this.data = data || {};

    // Dark overlay
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.85);
    bg.fillRect(0, 0, width, height);

    // Dead player sprite with bounce out
    const deadSprite = this.add.image(width/2, height*0.3, 'player_dead').setScale(4).setAlpha(0);
    this.tweens.add({ targets: deadSprite, alpha: 1, y: height*0.32, duration: 400 });

    // Title
    this.add.text(width/2 + 3, height*0.48 + 3, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '36px', color: '#440000'
    }).setOrigin(0.5);
    const title = this.add.text(width/2, height*0.48, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '36px', color: '#FF4444',
      stroke: '#880000', strokeThickness: 4
    }).setOrigin(0.5);

    // Shake animation
    this.tweens.add({ targets: title, x: width/2 + 4, duration: 60, yoyo: true, repeat: 5 });

    // Score
    const score = data.score || 0;
    this.add.text(width/2, height*0.6, `SCORE: ${String(score).padStart(6,'0')}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '14px', color: '#FFD700'
    }).setOrigin(0.5);

    this.add.text(width/2, height*0.68, `COINS: ${data.coins || 0}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#AADDFF'
    }).setOrigin(0.5);

    // Buttons (appear after 1.5s)
    this.time.delayedCall(1500, () => {
      this._makeBtn(width/2, height*0.79, '↩  TRY AGAIN', () => {
        this.scene.stop('GameOverScene');
        this.scene.start('GameScene', { level: data.level || 0, lives: 3, score: 0, coins: 0 });
      });
      this._makeBtn(width/2, height*0.89, '⌂  MAIN MENU', () => {
        this.scene.stop('GameOverScene');
        this.scene.start('MenuScene');
      });
    });
  }

  _makeBtn(x, y, label, cb) {
    const bw = 240, bh = 44;
    const bg = this.add.graphics();
    bg.fillStyle(0x880000, 1);
    bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 8);

    const txt = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#FFFFFF'
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, bw, bh).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => { bg.clear(); bg.fillStyle(0xAA2222); bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 8); });
    zone.on('pointerout',  () => { bg.clear(); bg.fillStyle(0x880000); bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 8); });
    zone.on('pointerdown', cb);

    this.input.keyboard.once('keydown-ENTER', cb);
  }
}
