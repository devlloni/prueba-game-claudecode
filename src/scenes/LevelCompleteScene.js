/**
 * LevelCompleteScene - Shown when player reaches the flag.
 */
class LevelCompleteScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelCompleteScene' }); }

  create(data) {
    const { width, height } = this.scale;

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.75);
    bg.fillRect(0, 0, width, height);

    // Panel
    const panel = this.add.graphics();
    panel.fillStyle(0x0a2a5a, 1);
    panel.fillRoundedRect(width/2-240, height/2-160, 480, 320, 20);
    panel.fillStyle(0x1155AA, 1);
    panel.fillRect(width/2-240, height/2-160, 480, 50);

    // Trophy emoji / big player
    this.add.image(width/2, height/2-90, 'player_big_idle').setScale(3);

    // Stars rain
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(20, width-20);
      const star = this.add.image(x, -20, 'particle_star').setScale(1.5);
      this.tweens.add({
        targets: star,
        y: height+20,
        duration: Phaser.Math.Between(1200, 2500),
        delay: i * 100,
        ease: 'Linear',
        onComplete: () => star.destroy()
      });
    }

    this.add.text(width/2, height/2-165, 'LEVEL CLEAR!', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '14px', color: '#FFD700'
    }).setOrigin(0.5);

    this.add.text(width/2, height/2+10, `SCORE:  ${String(data.score||0).padStart(6,'0')}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '12px', color: '#FFD700'
    }).setOrigin(0.5);
    this.add.text(width/2, height/2+32, `COINS:  ${data.coins||0}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#AADDFF'
    }).setOrigin(0.5);
    this.add.text(width/2, height/2+56, `LIVES:  ${data.lives||3}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#FF8888'
    }).setOrigin(0.5);

    // Next level button
    this.time.delayedCall(1000, () => {
      const nextLabel = data.nextLevel < LEVELS.length ? '▶  NEXT LEVEL' : '🏆  YOU WIN!';
      const nextBtnY = height/2 + 110;
      const bw=220, bh=44;
      const nbg = this.add.graphics();
      nbg.fillStyle(0x1B6B1B, 1); nbg.fillRoundedRect(width/2-bw/2, nextBtnY-bh/2, bw, bh, 8);
      this.add.text(width/2, nextBtnY, nextLabel, {
        fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#FFFFFF'
      }).setOrigin(0.5);
      this.add.zone(width/2, nextBtnY, bw, bh).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.nextLevel(data));

      this.input.keyboard.once('keydown', () => this.nextLevel(data));
    });
  }

  nextLevel(data) {
    this.scene.stop('LevelCompleteScene');
    if (data.nextLevel < LEVELS.length) {
      this.scene.start('GameScene', {
        level:      data.nextLevel,
        lives:      data.lives,
        score:      data.score,
        coins:      data.coins,
        playerName: data.playerName || window.PLAYER_NAME || 'PLAYER'
      });
    } else {
      this.scene.start('WinScene', data);
    }
  }
}
