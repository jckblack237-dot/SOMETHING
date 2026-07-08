export type Category = 'electronics' | 'groceries' | 'household';

/** Where a seller lists their prices: a physical shop, a shopping website, or a social page. */
export type SourceType = 'store' | 'online' | 'facebook' | 'instagram';

export interface Store {
  id: string;
  name: string;
  /** Short name for tight chart axes. */
  short: string;
  area: string;
  tagline: string;
  source: SourceType;
  /** Website or Facebook page, when the seller has one. */
  url?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  unit: string;
  /** Current listed price in MVR per seller — null when the seller doesn't carry it. */
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

export const SOURCE_LABEL: Record<SourceType, string> = {
  store: 'In-store',
  online: 'Online shop',
  facebook: 'Facebook page',
  instagram: 'Instagram page',
};

export const stores: Store[] = [
  // ——— Physical shops (some also sell online) ———
  { id: 'sto', name: 'STO Supermart', short: 'STO', area: 'Malé', tagline: 'State trading staples & appliances', source: 'store', url: 'https://sto.mv' },
  { id: 'agora', name: 'Agora Central', short: 'Agora', area: 'Malé', tagline: 'Neighbourhood supermarket chain', source: 'store' },
  { id: 'redwave', name: 'Redwave Mega', short: 'Redwave', area: 'Hulhumalé', tagline: 'Big-box groceries & electronics', source: 'store', url: 'https://redwave.mv' },
  { id: 'villamart', name: 'VillaMart', short: 'Villa', area: 'Malé', tagline: 'Fresh groceries & daily essentials', source: 'store', url: 'https://villamart.mv' },
  { id: 'sonee', name: 'Sonee Hardware', short: 'Sonee', area: 'Malé', tagline: 'Hardware, tools & home fittings', source: 'store', url: 'https://sonee.com.mv' },
  { id: 'damas', name: 'Damas Electronics', short: 'Damas', area: 'Malé', tagline: 'Phones, audio & home tech', source: 'store', url: 'https://damas.mv' },
  // ——— Shopping websites ———
  { id: 'esto', name: 'eSTO.mv', short: 'eSTO', area: 'Online', tagline: 'STO’s official online store', source: 'online', url: 'https://esto.mv' },
  { id: 'moolee', name: 'Moolee.mv', short: 'Moolee', area: 'Online', tagline: 'Nationwide online marketplace', source: 'online', url: 'https://moolee.mv' },
  // ——— Facebook shop pages ———
  { id: 'gadgethub', name: 'Gadget Hub MV', short: 'GadgetHub', area: 'Facebook', tagline: 'Phones & accessories via DM, Malé pickup', source: 'facebook', url: 'https://facebook.com/gadgethubmv' },
  { id: 'islandhome', name: 'Island Home MV', short: 'IslandHome', area: 'Facebook', tagline: 'Household & grocery deals, island delivery', source: 'facebook', url: 'https://facebook.com/islandhomemv' },
  // ——— Instagram shop pages ———
  { id: 'islegadgets', name: 'Isle Gadgets', short: 'IsleGadgets', area: 'Instagram', tagline: 'Tech drops & gray imports, DM to order', source: 'instagram', url: 'https://instagram.com/islegadgets.mv' },
  { id: 'casamaldives', name: 'Casa Maldives', short: 'Casa', area: 'Instagram', tagline: 'Home & living finds, ships to any island', source: 'instagram', url: 'https://instagram.com/casa.maldives' },
];

export const products: Product[] = [
  // ——— Electronics ———
  {
    id: 'galaxy-a55',
    name: 'Galaxy A55 5G 128GB',
    brand: 'Samsung',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: null, redwave: 6790, villamart: null, sonee: null, damas: 6499, esto: 6650, moolee: 6580, gadgethub: 6390, islandhome: null, islegadgets: 6450, casamaldives: null },
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15 128GB',
    brand: 'Apple',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: null, redwave: 18990, villamart: null, sonee: null, damas: 18450, esto: null, moolee: 18790, gadgethub: 17950, islandhome: null, islegadgets: 18190, casamaldives: null },
  },
  {
    id: 'sony-ch720n',
    name: 'WH-CH720N Headphones',
    brand: 'Sony',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: 2350, redwave: 2190, villamart: null, sonee: null, damas: 2090, esto: 2240, moolee: 2150, gadgethub: 1990, islandhome: null, islegadgets: 2040, casamaldives: null },
  },
  {
    id: 'samsung-tv-55',
    name: '55" Crystal UHD 4K TV',
    brand: 'Samsung',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: 12490, agora: null, redwave: 11990, villamart: null, sonee: 12250, damas: 11790, esto: 12190, moolee: 11890, gadgethub: null, islandhome: null, islegadgets: null, casamaldives: null },
  },
  {
    id: 'anker-20k',
    name: 'PowerCore 20,000mAh',
    brand: 'Anker',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: 949, redwave: 875, villamart: 990, sonee: null, damas: 849, esto: 920, moolee: 860, gadgethub: 795, islandhome: null, islegadgets: 819, casamaldives: null },
  },
  {
    id: 'jbl-flip6',
    name: 'Flip 6 Speaker',
    brand: 'JBL',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: null, agora: 2090, redwave: 1990, villamart: null, sonee: null, damas: 1890, esto: null, moolee: 1950, gadgethub: 1840, islandhome: null, islegadgets: 1870, casamaldives: null },
  },
  {
    id: 'tplink-ax55',
    name: 'Archer AX55 WiFi 6 Router',
    brand: 'TP-Link',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: 1790, agora: null, redwave: 1690, villamart: null, sonee: 1745, damas: 1620, esto: 1720, moolee: 1680, gadgethub: 1590, islandhome: null, islegadgets: 1640, casamaldives: null },
  },
  {
    id: 'midea-ac',
    name: '1.5HP Split AC Inverter',
    brand: 'Midea',
    category: 'electronics',
    unit: 'per unit',
    prices: { sto: 8990, agora: null, redwave: 9290, villamart: null, sonee: 8790, damas: 9150, esto: 8890, moolee: 9050, gadgethub: null, islandhome: null, islegadgets: null, casamaldives: null },
  },
  // ——— Groceries ———
  {
    id: 'basmathi-5kg',
    name: 'Basmathi Rice',
    brand: 'Falcon',
    category: 'groceries',
    unit: '5 kg bag',
    prices: { sto: 142, agora: 155, redwave: 139, villamart: 148, sonee: null, damas: null, esto: 145, moolee: 152, gadgethub: null, islandhome: 144, islegadgets: null, casamaldives: null },
  },
  {
    id: 'anchor-18',
    name: 'Full Cream Milk Powder',
    brand: 'Anchor',
    category: 'groceries',
    unit: '1.8 kg tin',
    prices: { sto: 389, agora: 405, redwave: 379, villamart: 398, sonee: null, damas: null, esto: 385, moolee: 402, gadgethub: null, islandhome: 375, islegadgets: null, casamaldives: null },
  },
  {
    id: 'sunflower-oil',
    name: 'Sunflower Oil',
    brand: 'Fortune',
    category: 'groceries',
    unit: '1.5 L bottle',
    prices: { sto: 82, agora: 89, redwave: 79, villamart: 86, sonee: null, damas: null, esto: 84, moolee: 88, gadgethub: null, islandhome: 81, islegadgets: null, casamaldives: null },
  },
  {
    id: 'eggs-30',
    name: 'Eggs Tray',
    brand: 'Farm fresh',
    category: 'groceries',
    unit: '30 eggs',
    prices: { sto: 72, agora: 79, redwave: 69, villamart: 75, sonee: null, damas: null, esto: 74, moolee: null, gadgethub: null, islandhome: 71, islegadgets: null, casamaldives: null },
  },
  {
    id: 'felivaru-tuna',
    name: 'Tuna Chunks in Oil',
    brand: 'Felivaru',
    category: 'groceries',
    unit: '185 g can',
    prices: { sto: 20, agora: 24, redwave: 21, villamart: 22, sonee: null, damas: null, esto: 21, moolee: 23, gadgethub: null, islandhome: 22, islegadgets: null, casamaldives: null },
  },
  {
    id: 'nescafe-200',
    name: 'Classic Instant Coffee',
    brand: 'Nescafé',
    category: 'groceries',
    unit: '200 g jar',
    prices: { sto: 139, agora: 152, redwave: 135, villamart: 146, sonee: null, damas: null, esto: 142, moolee: 149, gadgethub: null, islandhome: 138, islegadgets: null, casamaldives: null },
  },
  {
    id: 'sugar-1kg',
    name: 'White Sugar',
    brand: 'STO',
    category: 'groceries',
    unit: '1 kg pack',
    prices: { sto: 16, agora: 19, redwave: 17, villamart: 18, sonee: null, damas: null, esto: 16, moolee: null, gadgethub: null, islandhome: 18, islegadgets: null, casamaldives: null },
  },
  {
    id: 'munchee-cracker',
    name: 'Cream Cracker',
    brand: 'Munchee',
    category: 'groceries',
    unit: '500 g box',
    prices: { sto: 36, agora: 42, redwave: 35, villamart: 39, sonee: null, damas: null, esto: 37, moolee: 41, gadgethub: null, islandhome: 38, islegadgets: null, casamaldives: null },
  },
  // ——— Household ———
  {
    id: 'ariel-3kg',
    name: 'Detergent Powder',
    brand: 'Ariel',
    category: 'household',
    unit: '3 kg pack',
    prices: { sto: 189, agora: 205, redwave: 185, villamart: 199, sonee: 210, damas: null, esto: 192, moolee: 202, gadgethub: null, islandhome: 182, islegadgets: null, casamaldives: 188 },
  },
  {
    id: 'sunlight-750',
    name: 'Dishwash Liquid',
    brand: 'Sunlight',
    category: 'household',
    unit: '750 ml bottle',
    prices: { sto: 39, agora: 45, redwave: 38, villamart: 42, sonee: null, damas: null, esto: 40, moolee: 44, gadgethub: null, islandhome: 37, islegadgets: null, casamaldives: 41 },
  },
  {
    id: 'dettol-500',
    name: 'Antiseptic Liquid',
    brand: 'Dettol',
    category: 'household',
    unit: '500 ml bottle',
    prices: { sto: 74, agora: 82, redwave: 72, villamart: 79, sonee: 85, damas: null, esto: 76, moolee: 81, gadgethub: null, islandhome: 73, islegadgets: null, casamaldives: 75 },
  },
  {
    id: 'philips-led4',
    name: 'LED Bulb 9W E27',
    brand: 'Philips',
    category: 'household',
    unit: '4-pack',
    prices: { sto: 152, agora: 168, redwave: 149, villamart: null, sonee: 145, damas: 159, esto: 155, moolee: 150, gadgethub: 142, islandhome: 148, islegadgets: null, casamaldives: 146 },
  },
  {
    id: 'harpic-1l',
    name: 'Toilet Cleaner',
    brand: 'Harpic',
    category: 'household',
    unit: '1 L bottle',
    prices: { sto: 52, agora: 58, redwave: 49, villamart: 55, sonee: 59, damas: null, esto: 53, moolee: 57, gadgethub: null, islandhome: 51, islegadgets: null, casamaldives: 53 },
  },
  {
    id: 'basket-40l',
    name: 'Laundry Basket 40L',
    brand: 'Lion Star',
    category: 'household',
    unit: 'per unit',
    prices: { sto: null, agora: 155, redwave: 139, villamart: 149, sonee: 132, damas: null, esto: 145, moolee: 138, gadgethub: null, islandhome: 129, islegadgets: null, casamaldives: 135 },
  },
  {
    id: 'gas-stove',
    name: 'Double Burner Gas Stove',
    brand: 'Rinnai',
    category: 'household',
    unit: 'per unit',
    prices: { sto: 1190, agora: null, redwave: 1145, villamart: null, sonee: 1090, damas: 1210, esto: 1160, moolee: 1120, gadgethub: null, islandhome: 1075, islegadgets: null, casamaldives: 1095 },
  },
  {
    id: 'rice-cooker',
    name: 'Rice Cooker 1.8L',
    brand: 'Panasonic',
    category: 'household',
    unit: 'per unit',
    prices: { sto: 1420, agora: null, redwave: 1350, villamart: null, sonee: 1295, damas: 1390, esto: 1380, moolee: 1340, gadgethub: 1270, islandhome: 1310, islegadgets: null, casamaldives: 1305 },
  },
];
