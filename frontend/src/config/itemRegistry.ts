import { ItemDefinition } from '../types/item';

export const ItemRegistry: Record<string, ItemDefinition> = {
  wood: {
    id: 'wood',
    name: 'Wood',
    description: 'A sturdy piece of timber, useful for crafting and fuel.',
    category: 'resource',
    rarity: 'common',
    icon: 'item-wood',
    maxStack: 99
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    description: 'A rough rock slab, essential for construction.',
    category: 'resource',
    rarity: 'common',
    icon: 'item-stone',
    maxStack: 99
  },
  cloth: {
    id: 'cloth',
    name: 'Cloth',
    description: 'A woven piece of fabric, useful for bandages and armor crafting.',
    category: 'resource',
    rarity: 'common',
    icon: 'item-cloth',
    maxStack: 99
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'Raw iron ore waiting to be smelted.',
    category: 'resource',
    rarity: 'common',
    icon: 'item-iron-ore',
    maxStack: 99
  },
  rusty_sword: {
    id: 'rusty_sword',
    name: 'Rusty Sword',
    description: 'A basic, weather-worn blade.',
    category: 'weapon',
    rarity: 'common',
    icon: 'item-rusty-sword',
    maxStack: 1
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A finely forged steel blade that strikes with force.',
    category: 'weapon',
    rarity: 'rare',
    icon: 'item-iron-sword',
    maxStack: 1
  },
  leather_armor: {
    id: 'leather_armor',
    name: 'Leather Armor',
    description: 'Light protection made of cured hides.',
    category: 'armor',
    rarity: 'uncommon',
    icon: 'item-leather-armor',
    maxStack: 1
  },
  traveler_hood: {
    id: 'traveler_hood',
    name: 'Traveler Hood',
    description: 'A simple hood offering minor defense and improved agility.',
    category: 'armor',
    rarity: 'common',
    icon: 'item-traveler-hood',
    maxStack: 1
  },
  worn_leather_armor: {
    id: 'worn_leather_armor',
    name: 'Worn Leather Armor',
    description: 'Scuffed leather chestplate offering basic protection.',
    category: 'armor',
    rarity: 'common',
    icon: 'item-worn-leather-armor',
    maxStack: 1
  },
  old_boots: {
    id: 'old_boots',
    name: 'Old Boots',
    description: 'A pair of durable old boots, perfect for long travels.',
    category: 'armor',
    rarity: 'common',
    icon: 'item-old-boots',
    maxStack: 1
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    description: 'A sweet, crisp fruit. Restores a small amount of health.',
    category: 'consumable',
    rarity: 'common',
    icon: 'item-apple',
    maxStack: 10
  },
  ancient_key: {
    id: 'ancient_key',
    name: 'Ancient Key',
    description: 'A heavy key covered in mysterious runes.',
    category: 'quest',
    rarity: 'epic',
    icon: 'item-ancient-key',
    maxStack: 1
  }
};

