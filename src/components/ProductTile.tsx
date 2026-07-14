import {
  AirVent,
  BatteryCharging,
  Candy,
  Coffee,
  Cookie,
  CookingPot,
  Droplets,
  Egg,
  Fish,
  Flame,
  Headphones,
  Lightbulb,
  Milk,
  Package,
  Router,
  ShieldPlus,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Speaker,
  SprayCan,
  Tv,
  WashingMachine,
  Wheat,
} from 'lucide-react';
import type { Category, Product } from '../data/catalog';
import { CATEGORY_COLOR } from './ui';

const PRODUCT_ICON: Record<string, typeof Package> = {
  'galaxy-a55': Smartphone,
  'iphone-15': Smartphone,
  'sony-ch720n': Headphones,
  'samsung-tv-55': Tv,
  'anker-20k': BatteryCharging,
  'jbl-flip6': Speaker,
  'tplink-ax55': Router,
  'midea-ac': AirVent,
  'basmathi-5kg': Wheat,
  'anchor-18': Milk,
  'sunflower-oil': Droplets,
  'eggs-30': Egg,
  'felivaru-tuna': Fish,
  'nescafe-200': Coffee,
  'sugar-1kg': Candy,
  'munchee-cracker': Cookie,
  'ariel-3kg': WashingMachine,
  'sunlight-750': Sparkles,
  'dettol-500': ShieldPlus,
  'philips-led4': Lightbulb,
  'harpic-1l': SprayCan,
  'basket-40l': ShoppingBasket,
  'gas-stove': Flame,
  'rice-cooker': CookingPot,
};

const TILE_BG: Record<Category, string> = {
  electronics: '#f8e9e0',
  groceries: '#e4f1ec',
  household: '#efe9f7',
};

/**
 * Warm product visual standing in for a photo: a category-tinted tile with the
 * product's icon. `badge` renders a small sale-style chip in the corner.
 */
export default function ProductTile({
  product,
  badge,
  iconSize = 44,
  className = '',
  arch = false,
}: {
  product: Product;
  badge?: string;
  iconSize?: number;
  className?: string;
  arch?: boolean;
}) {
  const Icon = PRODUCT_ICON[product.id] ?? Package;
  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center overflow-hidden ${arch ? 'rounded-t-full rounded-b-xl' : 'rounded-xl'} ${className}`}
      style={{ background: TILE_BG[product.category] }}
    >
      <Icon size={iconSize} strokeWidth={1.4} style={{ color: CATEGORY_COLOR[product.category] }} />
      {badge && (
        <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-page">
          {badge}
        </span>
      )}
    </div>
  );
}
