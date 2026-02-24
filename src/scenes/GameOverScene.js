/**
 * GameOverScene - Mostrada cuando el jugador pierde todas las vidas.
 * Guarda automáticamente el score en el leaderboard si califica.
 */
class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  create(data) {
    const { width, height } = this.scale;
    this.data = data || {};

    // ── Fondo ─────────────────────────────────────────────────────────────────
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.85);
    bg.fillRect(0, 0, width, height);

    // Sprite del jugador muerto
    const deadSprite = this.add.image(width/2, height*0.3, 'player_dead').setScale(4).setAlpha(0);
    this.tweens.add({ targets: deadSprite, alpha: 1, y: height*0.32, duration: 400 });

    // ── Título ────────────────────────────────────────────────────────────────
    this.add.text(width/2 + 3, height*0.46 + 3, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '36px', color: '#440000'
    }).setOrigin(0.5);
    const title = this.add.text(width/2, height*0.46, 'GAME OVER', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '36px', color: '#FF4444',
      stroke: '#880000', strokeThickness: 4
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, x: width/2 + 4, duration: 60, yoyo: true, repeat: 5 });

    // ── Score ─────────────────────────────────────────────────────────────────
    const score = data.score || 0;
    this.add.text(width/2, height*0.57, `SCORE: ${String(score).padStart(7,'0')}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '13px', color: '#FFD700'
    }).setOrigin(0.5);
    this.add.text(width/2, height*0.64, `COINS: ${data.coins || 0}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#AADDFF'
    }).setOrigin(0.5);

    // ── Nombre del jugador ────────────────────────────────────────────────────
    const playerName = data.playerName || window.PLAYER_NAME || 'PLAYER';
    this.add.text(width/2, height*0.70, `JUGADOR: ${playerName}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#AAAAAA'
    }).setOrigin(0.5);

    // ── Guardar en leaderboard ────────────────────────────────────────────────
    let savedResult = null;
    if (Leaderboard.isHighScore(score)) {
      savedResult = Leaderboard.add(playerName, score, data.coins || 0);
      this.add.text(width/2, height*0.76, '★ NUEVO RECORD GUARDADO ★', {
        fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: '#FFD700',
        stroke: '#885500', strokeThickness: 2
      }).setOrigin(0.5);
    }

    // ── Botones (aparecen tras 1.5s) ─────────────────────────────────────────
    this.time.delayedCall(1500, () => {
      this._makeBtn(width/2, height*0.83, '↩  INTENTAR DE NUEVO', () => {
        this.scene.stop('GameOverScene');
        this.scene.start('GameScene', {
          level: data.level || 0, lives: 3, score: 0, coins: 0,
          playerName: playerName
        });
      });
      this._makeBtn(width/2, height*0.91, '⌂  MENU PRINCIPAL', () => {
        this.scene.stop('GameOverScene');
        this.scene.start('MenuScene');
      });
      if (savedResult) {
        this._makeBtn(width/2, height*0.975, '★  VER SCORES', () => {
          this.scene.stop('GameOverScene');
          this.scene.start('LeaderboardScene', {
            from:     'MenuScene',
            newEntry: { name: savedResult.entry.name, score: savedResult.entry.score, rank: savedResult.rank }
          });
        });
      }
    });
  }

  _makeBtn(x, y, label, cb) {
    const bw = 260, bh = 38;
    const bg = this.add.graphics();
    bg.fillStyle(0x880000, 1);
    bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 8);

    const txt = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#FFFFFF'
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, bw, bh).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => { bg.clear(); bg.fillStyle(0xAA2222); bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 8); });
    zone.on('pointerout',  () => { bg.clear(); bg.fillStyle(0x880000); bg.fillRoundedRect(x-bw/2, y-bh/2, bw, bh, 8); });
    zone.on('pointerdown', cb);

    this.input.keyboard.once('keydown-ENTER', cb);
  }
}
