import Phaser from 'phaser';
import { LootEntity } from '../entities/LootEntity';
import { ItemRegistry } from '../config/itemRegistry';
import { useInventoryStore } from '../stores/inventoryStore';
import { ToastManager } from '../ui/ToastManager';
import { DamageSystem } from './DamageSystem';
import { RarityColors } from '../config/equipmentRegistry';

interface LootDropConfig {
  itemId: string;
  chance: number; // 0 to 1
  minQty: number;
  maxQty: number;
}

export class LootSystem {
  private scene: Phaser.Scene;
  private player: Phaser.Physics.Arcade.Sprite;
  private lootGroup: Phaser.Physics.Arcade.Group;
  
  // Proximity Attraction Config
  private magneticRadius = 90;
  private attractionSpeed = 300;

  // Reusable drop tables for enemies
  private lootTables: Record<string, LootDropConfig[]> = {
    slime: [
      { itemId: 'wood', chance: 0.40, minQty: 1, maxQty: 2 },
      { itemId: 'stone', chance: 0.30, minQty: 1, maxQty: 2 },
      { itemId: 'cloth', chance: 0.25, minQty: 1, maxQty: 2 },
      { itemId: 'apple', chance: 0.15, minQty: 1, maxQty: 1 },
      
      // Temporary High Test Rates (25% each)
      { itemId: 'iron_sword', chance: 0.25, minQty: 1, maxQty: 1 },
      { itemId: 'traveler_hood', chance: 0.25, minQty: 1, maxQty: 1 },
      { itemId: 'old_boots', chance: 0.25, minQty: 1, maxQty: 1 }
    ]
  };

  constructor(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Sprite) {
    this.scene = scene;
    this.player = player;

    // Create a physics group to manage all loot sprites
    this.lootGroup = this.scene.physics.add.group({
      classType: LootEntity,
      runChildUpdate: true
    });

    // Setup overlap collision with player
    this.scene.physics.add.overlap(
      this.player,
      this.lootGroup,
      this.handlePickup,
      undefined,
      this
    );

    // Register event listener for enemy deaths
    this.scene.events.on('enemy:death', this.onEnemyDeath, this);

    // Clean up on scene shutdown
    this.scene.events.once('shutdown', () => {
      this.destroy();
    });
  }

  public update(): void {
    if (!this.player || !this.player.active) return;

    // Proximity check: pull items towards player magnetically
    this.lootGroup.getChildren().forEach((child) => {
      const loot = child as LootEntity;
      if (!loot.active || !loot.body) return;

      const dist = Phaser.Math.Distance.Between(loot.x, loot.y, this.player.x, this.player.y);
      if (dist <= this.magneticRadius) {
        // Disable drag to allow swift sliding attraction
        const body = loot.body as Phaser.Physics.Arcade.Body;
        body.setDrag(0);

        // Fly towards player
        const angle = Phaser.Math.Angle.Between(loot.x, loot.y, this.player.x, this.player.y);
        body.setVelocity(
          Math.cos(angle) * this.attractionSpeed,
          Math.sin(angle) * this.attractionSpeed
        );
      }
    });
  }

  private onEnemyDeath(data: { id: string; type: string; x: number; y: number }): void {
    const table = this.lootTables[data.type];
    if (!table) return;

    table.forEach((drop) => {
      if (Math.random() <= drop.chance) {
        const qty = Phaser.Math.Between(drop.minQty, drop.maxQty);
        const itemDef = ItemRegistry[drop.itemId];
        const rarity = itemDef ? itemDef.rarity : 'common';
        
        // Spawn loot entity in scene
        const loot = new LootEntity(this.scene, data.x, data.y, drop.itemId, qty, rarity);
        this.lootGroup.add(loot);
      }
    });
  }

  private handlePickup(player: any, child: any): void {
    const loot = child as LootEntity;
    if (!loot.active) return;

    // Temporarily deactivate physics body to prevent double-pickup
    if (loot.body) {
      loot.body.enable = false;
    }

    const itemDef = ItemRegistry[loot.itemId];
    const itemName = itemDef ? itemDef.name : loot.itemId;
    const rarity = itemDef ? itemDef.rarity : 'common';
    const rarityInfo = RarityColors[rarity] || RarityColors.common;

    // Send item addition request to database/store
    useInventoryStore.getState().addItem(loot.itemId, loot.quantity).then((res) => {
      if (res) {
        // Find existing ToastManager in scene
        const toast = (this.scene as any).toastManager as ToastManager;
        if (toast) {
          toast.showToast(`Picked up: ${itemName} x${loot.quantity}`);
        }

        // Show a premium floating toast above player
        DamageSystem.showFloatingText(
          this.scene,
          player.x,
          player.y - 20,
          `+${loot.quantity} ${itemName}`,
          rarityInfo.hexString,
          1.1
        );
      } else {
        console.error('Failed to persist loot item on server:', loot.itemId);
      }

      // Visual shrink-fade pickup feedback
      this.scene.tweens.add({
        targets: loot,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 180,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          loot.destroy();
        }
      });
    }).catch((err) => {
      console.error('Error adding item on pickup:', err);
      loot.destroy();
    });
  }

  public destroy(): void {
    this.scene.events.off('enemy:death', this.onEnemyDeath, this);
    this.lootGroup.destroy(true);
  }
}
