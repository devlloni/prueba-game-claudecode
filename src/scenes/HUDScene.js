/**
 * HUDScene - Overlay UI: score, coins, lives, timer, level name.
 * Runs in parallel with GameScene.
 */
class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' });
    this.scoreVal = 0;
    this.coinVal  = 0;
    this.livesVal = 3;
    this.timeVal  = 400;
    this.levelName = '';
    this.paused   = false;
  }

  create(data) {
    this.scoreVal = data.score || 0;
    this.coinVal  = data.coins || 0;
    this.livesVal = data.lives || 3;
    this.timeVal  = 400;
    this.levelName = data.levelName || '';

    const { width } = this.scale;

    // Semi-transparent top bar
    const bar = this.add.graphics();
    bar.fillStyle(0x000000, 0.55);
    bar.fillRect(0, 0, width, 44);

    // SCORE
    this.add.text(16, 8, 'SCORE', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: '#FFD700'
    });
    this.scoreTxt = this.add.text(16, 20, '000000', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#FFFFFF'
    });

    // COINS
    this.add.image(width/2 - 40, 22, 'ui_coin').setScale(0.9);
    this.coinTxt = this.add.text(width/2 - 24, 16, '×00', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#FFFFFF'
    });

    // LIVES
    this.add.image(width - 130, 22, 'ui_heart').setScale(0.9);
    this.livesTxt = this.add.text(width - 112, 16, '×' + this.livesVal, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#FFFFFF'
    });

    // TIMER
    this.add.text(width - 60, 8, 'TIME', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: '#FFD700'
    });
    this.timerTxt = this.add.text(width - 55, 20, '400', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#FFFFFF'
    });

    // LEVEL NAME (centered, fades out)
    this.levelNameTxt = this.add.text(width/2, 80, this.levelName, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '14px',
      color: '#FFD700', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(1);
    this.time.delayedCall(2500, () => {
      this.tweens.add({ targets: this.levelNameTxt, alpha: 0, duration: 800 });
    });

    // PAUSE overlay elements (hidden by default)
    this.pauseOverlay = this.add.graphics().setVisible(false).setDepth(50);
    this.pauseOverlay.fillStyle(0x000000, 0.6);
    this.pauseOverlay.fillRect(0, 0, this.scale.width, this.scale.height);

    this.pauseText = this.add.text(width/2, this.scale.height/2, 'PAUSED', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '28px',
      color: '#FFD700', stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(51).setVisible(false);

    this.resumeHint = this.add.text(width/2, this.scale.height/2 + 50, 'Press P to Resume', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#FFFFFF'
    }).setOrigin(0.5).setDepth(51).setVisible(false);

    // Listen to game events
    const game = this.scene.get('GameScene');
    game.events.on('score-update', (v) => this.setScore(v), this);
    game.events.on('coin-update',  (v) => this.setCoins(v), this);
    game.events.on('lives-update', (v) => this.setLives(v), this);
    game.events.on('paused',       ()  => this.showPause(), this);
    game.events.on('resumed',      ()  => this.hidePause(), this);
    game.events.on('time-update',  (v) => this.setTime(v), this);

    // Keyboard: P = pause
    this.input.keyboard.on('keydown-P', () => {
      const gs = this.scene.get('GameScene');
      if (gs.gamePaused) { gs.resumeGame(); } else { gs.pauseGame(); }
    });
    this.input.keyboard.on('keydown-ESC', () => {
      const gs = this.scene.get('GameScene');
      if (gs.gamePaused) { gs.resumeGame(); } else { gs.pauseGame(); }
    });
  }

  setScore(v) {
    this.scoreVal = v;
    this.scoreTxt.setText(String(v).padStart(6, '0'));
    // Pop animation
    this.tweens.add({ targets: this.scoreTxt, scaleX: 1.3, scaleY: 1.3, duration: 80, yoyo: true });
  }
  setCoins(v) {
    this.coinVal = v;
    this.coinTxt.setText('×' + String(v).padStart(2, '0'));
    this.tweens.add({ targets: this.coinTxt, scaleX: 1.3, scaleY: 1.3, duration: 80, yoyo: true });
  }
  setLives(v) {
    this.livesVal = v;
    this.livesTxt.setText('×' + v);
  }
  setTime(v) {
    this.timeVal = v;
    this.timerTxt.setText(String(Math.max(0, Math.floor(v))));
    if (v <= 60) this.timerTxt.setColor('#FF4444');
    else this.timerTxt.setColor('#FFFFFF');
  }

  showPause() {
    this.pauseOverlay.setVisible(true);
    this.pauseText.setVisible(true);
    this.resumeHint.setVisible(true);
  }
  hidePause() {
    this.pauseOverlay.setVisible(false);
    this.pauseText.setVisible(false);
    this.resumeHint.setVisible(false);
  }
}
