export type Category = 'electronics' | 'groceries' | 'household';

export interface Store {
  id: string;
  name: string;
  /** Short name for tight chart axes. */
  short: string;
  area: string;
  tagline: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  unit: string;
  /** Current shelf price in MVR per store — null when the store doesn't carry it. */
  prices: Record<string, number | null>;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'groceries', label: 'Groceries' },
  { id: 'household', label: 'Household' },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  electronics: 'Electronics',
  groceries: 'Groceries',
  household: 'Household',
};

export const stores: Store[] = [
  { id: 'sto', name: 'STO Supermart', short: 'STO', area: 'Malé', tagline: 'State trading staples & appliances' },
  { id: 'agora', name: 'Agora Central', short: 'Agora', area: 'Malé', tagline: 'Neighbourhood supermarket chain' },
  { id: 'redwave', name: 'Redwave Mega', short: 'Redwave', area: 'Hulhumalé', tagline: 'Big-box groceries & electronics' },
  { id: 'villamart', name: 'VillaMart', short: 'Villa', area: 'Malé', tagline: 'Fresh groceries & daily essentials' },
  { id: 'sonee', name: 'Sonee Hardware', short: 'Sonee', area: 'Malé', tagline: 'Hardware, tools & home fittings' },
  { id: 'damas', name: 'Damas Electronics', short: 'Damas', area: 'Malé', tagline: 'Phones, audio & home tech' },
];

export const products: Product[] = [
  // ——— Electronics ———
  {
    id: 'galaxy-a55',
    name: 'Galaxy A55 5G 128GB',
    brand: 'Samsung',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: null, redwave: 6790, villamart: null, sonee: null, damas: 6499 },
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15 128GB',
    brand: 'Apple',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: null, redwave: 18990, villamart: null, sonee: null, damas: 18450 },
  },
  {
    id: 'sony-ch720n',
    name: 'WH-CH720N Headphones',
    brand: 'Sony',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: 2350, redwave: 2190, villamart: null, sonee: null, damas: 2090 },
  },
  {
    id: 'samsung-tv-55',
    name: '55" Crystal UHD 4K TV',
    brand: 'Samsung',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: 12490, agora: null, redwave: 11990, villamart: null, sonee: 12250, damas: 11790 },
  },
  {
    id: 'anker-20k',
    name: 'PowerCore 20,000mAh',
    brand: 'Anker',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: 949, redwave: 875, villamart: 990, sonee: null, damas: 849 },
  },
  {
    id: 'jbl-flip6',
    name: 'Flip 6 Speaker',
    brand: 'JBL',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: 2090, redwave: 1990, villamart: null, sonee: null, damas: 1890 },
  },
  {
    id: 'tplink-ax55',
    name: 'Archer AX55 WiFi 6 Router',
    brand: 'TP-Link',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: 1790, agora: null, redwave: 1690, villamart: null, sonee: 1745, damas: 1620 },
  },
  {
    id: 'midea-ac',
    name: '1.5HP Split AC Inverter',
    brand: 'Midea',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: 8990, agora: null, redwave: 9290, villamart: null, sonee: 8790, damas: 9150 },
  },
  // ——— Groceries ———
  {
    id: 'basmathi-5kg',
    name: 'Basmathi Rice',
    brand: 'Falcon',
    category: 'groceries',
    unit: '5 kg bag',
    prices: { sto: 142, agora: 155, redwave: 139, villamart: 148, sonee: null, damas: null },
  },
  {
    id: 'anchor-18',
    name: 'Full Cream Milk Powder',
    brand: 'Anchor',
    category: 'groceries',
    unit: '1.8 kg tin',
    prices: { sto: 389, agora: 405, redwave: 379, villamart: 398, sonee: null, damas: null },
  },
  {
    id: 'sunflower-oil',
    name: 'Sunflower Oil',
    brand: 'Fortune',
    category: 'groceries',
    unit: '1.5 L bottle',
    prices: { sto: 82, agora: 89, redwave: 79, villamart: 86, sonee: null, damas: null },
  },
  {
    id: 'eggs-30',
    name: 'Eggs Tray',
    brand: 'Farm fresh',
    category: 'groceries',
    unit: '30 eggs',
    prices: { sto: 72, agora: 79, redwave: 69, villamart: 75, sonee: null, damas: null },
  },
  {
    id: 'felivaru-tuna',
    name: 'Tuna Chunks in Oil',
    brand: 'Felivaru',
    category: 'groceries',
    unit: '185 g can',
    prices: { sto: 20, agora: 24, redwave: 21, villamart: 22, sonee: null, damas: null },
  },
  {
    id: 'nescafe-200',
    name: 'Classic Instant Coffee',
    brand: 'Nescafé',
    category: 'groceries',
    unit: '200 g jar',
    prices: { sto: 139, agora: 152, redwave: 135, villamart: 146, sonee: null, damas: null },
  },
  {
    id: 'sugar-1kg',
    name: 'White Sugar',
    brand: 'STO',
    category: 'groceries',
    unit: '1 kg pack',
    prices: { sto: 16, agora: 19, redwave: 17, villamart: 18, sonee: null, damas: null },
  },
  {
    id: 'munchee-cracker',
    name: 'Cream Cracker',
    brand: 'Munchee',
    category: 'groceries',
    unit: '500 g box',
    prices: { sto: 36, agora: 42, redwave: 35, villamart: 39, sonee: null, damas: null },
  },
  // ——— Household ———
  {
    id: 'ariel-3kg',
    name: 'Detergent Powder',
    brand: 'Ariel',
    category: 'household',
    unit: '3 kg pack',
    prices: { sto: 189, agora: 205, redwave: 185, villamart: 199, sonee: 210, damas: null },
  },
  {
    id: 'sunlight-750',
    name: 'Dishwash Liquid',
    brand: 'Sunlight',
    category: 'household',
    unit: '750 ml bottle',
    prices: { sto: 39, agora: 45, redwave: 38, villamart: 42, sonee: null, damas: null },
  },
  {
    id: 'dettol-500',
    name: 'Antiseptic Liquid',
    brand: 'Dettol',
    category: 'household',
    unit: '500 ml bottle',
    prices: { sto: 74, agora: 82, redwave: 72, villamart: 79, sonee: 85, damas: null },
  },
  {
    id: 'philips-led4',
    name: 'LED Bulb 9W E27',
    brand: 'Philips',
    category: 'household',
    unit: '4-pack',
    prices: { sto: 152, agora: 168, redwave: 149, villamart: null, sonee: 145, damas: 159 },
  },
  {
    id: 'harpic-1l',
    name: 'Toilet Cleaner',
    brand: 'Harpic',
    category: 'household',
    unit: '1 L bottle',
    prices: { sto: 52, agora: 58, redwave: 49, villamart: 55, sonee: 59, damas: null },
  },
  {
    id: 'basket-40l',
    name: 'Laundry Basket 40L',
    brand: 'Lion Star',
    category: 'household',
    unit: 'per unit',
    prices: { sto: null, agora: 155, redwave: 139, villamart: 149, sonee: 132, damas: null },
  },
  {
    id: 'gas-stove',
    name: 'Double Burner Gas Stove',
    brand: 'Rinnai',
    category: 'household',
    unit: 'per unit',
    prices: { sto: 1190, agora: null, redwave: 1145, villamart: null, sonee: 1090, damas: 1210 },
  },
  {
    id: 'rice-cooker',
    name: 'Rice Cooker 1.8L',
    brand: 'Panasonic',
    category: 'household',
    unit: 'per unit',
    prices: { sto: 1420, agora: null, redwave: 1350, villamart: null, sonee: 1295, damas: 1390 },
  },
];
