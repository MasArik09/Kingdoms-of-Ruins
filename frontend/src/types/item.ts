export type ItemCategory = 'resource' | 'weapon' | 'armor' | 'consumable' | 'quest';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  maxStack: number;
  icon: string;
}

export interface InventoryItem {
  id?: number;
  ownerType: string;
  ownerId: string;
  itemId: string;
  quantity: number;
}

