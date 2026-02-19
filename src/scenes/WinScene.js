/**
 * WinScene - Shown when player completes all levels.
 */
class WinScene extends Phaser.Scene {
  constructor() { super({ key: 'WinScene' }); }

  create(data) {
    const { width, height } = this.scale;

    // Gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a3a, 0x0a0a3a, 0x1a0a4a, 0x1a0a4a, 1);
    bg.fillRect(0, 0, width, height);

    // Firework effect
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(50, width-50);
      const y = Phaser.Math.Between(50, height*0.6);
      const colors = [0xFFD700, 0xFF4444, 0x44FF44, 0x4444FF, 0xFF44FF];
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.time.delayedCall(i * 150, () => {
        const circle = this.add.circle(x, y, 3, color);
        this.tweens.add({
          targets: circle, scaleX: 8, scaleY: 8, alpha: 0,
          duration: 600, ease: 'Power2', onComplete: () => circle.destroy()
        });
        // Lines
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2;
          const particle = this.add.rectangle(x, y, 3, 3, color);
          this.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * 80,
            y: y + Math.sin(angle) * 80,
            alpha: 0, duration: 700,
            ease: 'Power2', onComplete: () => particle.destroy()
          });
        }
      });
    }

    // Big player animated
    const player = this.add.image(width/2, height*0.3, 'player_big_idle').setScale(4);
    this.tweens.add({
      targets: player, y: height*0.3 - 20, angle: { from: -5, to: 5 },
      duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // Trophy stars
    [-80, 0, 80].forEach((dx, i) => {
      const star = this.add.image(width/2 + dx, height*0.45, 'particle_star').setScale(2);
      this.tweens.add({
        targets: star, scaleX: 2.5, scaleY: 2.5, duration: 400 + i*100,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i*150
      });
    });

    // YOU WIN!
    this.add.text(width/2 + 4, height*0.55 + 4, '🏆  YOU WIN!  🏆', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '28px', color: '#000000', alpha: 0.5
    }).setOrigin(0.5);
    const winText = this.add.text(width/2, height*0.55, '🏆  YOU WIN!  🏆', {
      fontFamily: '"Press Start 2P", monospace', fontSize: '28px',
      color: '#FFD700', stroke: '#CC8800', strokeThickness: 4
    }).setOrigin(0.5);
    this.tweens.add({ targets: winText, scaleX: 1.1, scaleY: 1.1, duration: 800, yoyo: true, repeat: -1 });

    const score = data.score || 0;
    this.add.text(width/2, height*0.66, `FINAL SCORE: ${String(score).padStart(6,'0')}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '12px', color: '#FFD700'
    }).setOrigin(0.5);
    this.add.text(width/2, height*0.73, `TOTAL COINS: ${data.coins||0}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#AADDFF'
    }).setOrigin(0.5);

    // Rank
    let rank = 'C';
    if (score > 10000) rank = 'B';
    if (score > 25000) rank = 'A';
    if (score > 50000) rank = 'S';
    const rankColors = { S: '#FFD700', A: '#FF6633', B: '#AAAAFF', C: '#888888' };
    this.add.text(width/2, height*0.80, `RANK: ${rank}`, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: rankColors[rank],
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    // Play again
    this.time.delayedCall(1500, () => {
      const btnY = height*0.91;
      const bg2 = this.add.graphics();
      bg2.fillStyle(0x1565C0); bg2.fillRoundedRect(width/2-100, btnY-22, 200, 44, 8);
      this.add.text(width/2, btnY, 'PLAY AGAIN', {
        fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: '#FFFFFF'
      }).setOrigin(0.5);
      this.add.zone(width/2, btnY, 200, 44).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.scene.stop('WinScene');
          this.scene.start('MenuScene');
        });
      this.input.keyboard.once('keydown', () => {
        this.scene.stop('WinScene');
        this.scene.start('MenuScene');
      });
    });
  }
}
