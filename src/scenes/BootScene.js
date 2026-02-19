/**
 * BootScene - Generates all textures and shows a loading screen,
 * then transitions to the main menu.
 */
class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {}

  create() {
    const { width, height } = this.scale;

    // Dark background
    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Logo text
    const logo = this.add.text(width / 2, height / 2 - 60, 'PIXEL HOP', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '36px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#CC8800', blur: 0, fill: true }
    }).setOrigin(0.5);

    const sub = this.add.text(width / 2, height / 2 + 10, 'ADVENTURE', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '18px',
      color: '#88CCFF',
    }).setOrigin(0.5);

    const loadingText = this.add.text(width / 2, height / 2 + 70, 'Loading...', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#AAAAAA',
    }).setOrigin(0.5);

    // Animate logo
    this.tweens.add({
      targets: logo,
      y: height / 2 - 70,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Generate all textures
    const factory = new TextureFactory(this);
    factory.createAll();

    // Brief delay then go to menu
    this.time.delayedCall(1200, () => {
      loadingText.setText('Press any key!');
      this.input.once('pointerdown', () => this.scene.start('MenuScene'));
      this.input.keyboard.once('keydown', () => this.scene.start('MenuScene'));
      this.time.delayedCall(3000, () => {
        if (this.scene.isActive('BootScene')) this.scene.start('MenuScene');
      });
    });
  }
}
