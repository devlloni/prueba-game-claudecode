/**
 * PowerUp sprites - mushroom, star, flower
 */
class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const textureMap = {
      mushroom: 'powerup_mushroom',
      star:     'powerup_star',
      flower:   'powerup_flower',
      coin:     'coin',
    };
    super(scene, x, y, textureMap[type] || 'powerup_mushroom');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.powerType = type;
    this.setDepth(8);

    if (type === 'coin') {
      // Coins pop up and disappear
      this.body.setAllowGravity(false);
      this.body.setVelocityY(-200);
      this.scene.tweens.add({
        targets: this,
        y: y - 64,
        alpha: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => this.destroy()
      });
      this.collected = true; // auto-collect via animation
    } else if (type === 'star') {
      // Star bounces
      this.body.setVelocityX(120);
      this.body.setVelocityY(-400);
      this.body.setBounceY(0.7);
      this.body.setGravityY(200);
      // Spin effect
      this.scene.tweens.add({
        targets: this,
        angle: 360,
        duration: 600,
        repeat: -1
      });
    } else {
      // Mushroom/flower slides out
      this.body.setVelocityX(80);
      this.body.setGravityY(100);
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.collected) {
      if (this.body.blocked.right) this.body.setVelocityX(-80);
      if (this.body.blocked.left)  this.body.setVelocityX(80);
    }
  }

  collect() {
    if (this.collected) return;
    this.collected = true;
    this.destroy();
  }
}
