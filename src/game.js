/**
 * game.js - Phaser 3 game configuration and entry point.
 * All scenes and globals are loaded via script tags in index.html.
 */

// Responsive sizing
function getGameSize() {
  const maxW = 800, maxH = 480;
  const sw = window.innerWidth, sh = window.innerHeight;
  const ratio = maxW / maxH;
  let w = sw, h = sw / ratio;
  if (h > sh) { h = sh; w = h * ratio; }
  // On mobile, use full screen
  if (w > maxW) { w = maxW; h = maxH; }
  return { width: Math.floor(w), height: Math.floor(h) };
}

const { width, height } = getGameSize();

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'game-container',
  backgroundColor: '#4FC3F7',
  pixelArt: true,
  antialias: false,
  roundPixels: true,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 480,
    // Expand the parent container to fill the full viewport on mobile
    expandParent: true,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    }
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
    postBoot: function (game) {
      // Ensure canvas is crisp on high-DPI screens
      const canvas = game.canvas;
      canvas.style.imageRendering = 'pixelated';
    }
  }
};

// Create the game
window.game = new Phaser.Game(config);

// Handle resize
window.addEventListener('resize', () => {
  window.game.scale.refresh();
});

// Prevent arrow key scrolling on desktop
window.addEventListener('keydown', (e) => {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
  if (keys.includes(e.key)) e.preventDefault();
}, { passive: false });
