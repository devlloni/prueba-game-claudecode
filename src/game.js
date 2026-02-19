/**
 * game.js – Phaser 3 config + entry point.
 *
 * Screen-fitting strategy:
 *   • Logical height is always 480 px (matches all level data).
 *   • Logical width = round(480 × screen-aspect-ratio), clamped to [640, 1280].
 *   • Phaser Scale.FIT scales this logical canvas to fill the physical screen
 *     with the same aspect ratio → zero letterboxing in landscape.
 */

function getGameDimensions() {
  const sw = window.innerWidth;
  const sh = window.innerHeight;
  const H  = 480;
  // Use the landscape ratio regardless of current orientation
  const ratio = Math.max(sw, sh) / Math.min(sw, sh);
  const W = Math.max(640, Math.min(1280, Math.round(H * ratio)));
  return { width: W, height: H };
}

const { width: GAME_W, height: GAME_H } = getGameDimensions();

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#4FC3F7',
  pixelArt: true,
  antialias: false,
  roundPixels: true,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width:  GAME_W,
    height: GAME_H,
    expandParent: true,
  },

  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: false }
  },

  scene: [
    BootScene,
    MenuScene,
    GameScene,
    HUDScene,
    GameOverScene,
    LevelCompleteScene,
    WinScene,
  ],

  callbacks: {
    postBoot(game) {
      game.canvas.style.imageRendering = 'pixelated';
    }
  }
};

window.game = new Phaser.Game(config);

// Re-fit when device rotates or browser chrome changes
window.addEventListener('resize', () => {
  window.game.scale.refresh();
});

// Prevent arrow-key / space scrolling on desktop
window.addEventListener('keydown', (e) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))
    e.preventDefault();
}, { passive: false });
