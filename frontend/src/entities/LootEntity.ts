import Phaser from 'phaser';
import { ItemRarity } from '../types/item';
import { ItemRegistry } from '../config/itemRegistry';

export class LootEntity extends Phaser.Physics.Arcade.Sprite {
  public itemId: string;
  public quantity: number;
  public rarity: ItemRarity;
  private glowImage: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, itemId: string, quantity: number, rarity: ItemRarity) {
    const def = ItemRegistry[itemId];
    const textureKey = def ? def.icon : 'item-wood';
    
    super(scene, x, y, textureKey);
    this.itemId = itemId;
    this.quantity = quantity;
    this.rarity = rarity;

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Visual scale and depth
    this.setDisplaySize(28, 28);
    this.setDepth(y);

    // Create static rarity glow image behind the item
    this.glowImage = scene.add.image(x, y, `glow-${rarity}`);
    this.glowImage.setScale(0.8);
    this.glowImage.setAlpha(0.7);
    this.glowImage.setDepth(this.depth - 1);

    // Configure physics behavior
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setCollideWorldBounds(true);
      body.setSize(24, 24);
      // Friction/drag to slow down after being kicked out
      body.setDrag(180);
      
      // Random knockback trajectory when spawned
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const speed = Phaser.Math.Between(100, 180);
      body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }

    // Spawn-in visual pop: scale bounce
    this.setScale(0.1);
    scene.tweens.add({
      targets: this,
      scaleX: 0.45, // equivalent display size of 28px
      scaleY: 0.45,
      duration: 350,
      ease: 'Back.easeOut'
    });

    // Subtly pulse the glow scale
    scene.tweens.add({
      targets: this.glowImage,
      scale: 1.1,
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    
    // Maintain depth based on vertical position
    this.setDepth(this.y);
    
    // Sync glow image position and depth
    if (this.glowImage && this.glowImage.active) {
      this.glowImage.setPosition(this.x, this.y);
      this.glowImage.setDepth(this.depth - 1);
    }
  }

  public destroy(fromScene?: boolean): void {
    if (this.glowImage) {
      this.glowImage.destroy();
    }
    super.destroy(fromScene);
  }
}
