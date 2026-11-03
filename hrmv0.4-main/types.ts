export enum ProductType {
  SPARE_PART = 'SPARE_PART',
  TIRE = 'TIRE',
}

export enum SparePartClass {
  GENUINE = 'Phụ tùng chính hãng',
  OEM = 'Phụ tùng OEM',
  REPLACEMENT = 'Phụ tùng thay thế',
  RECYCLED = 'Phụ tùng tái chế / Tháo xe',
}

export interface Specification {
  id: number;
  name: string;
  value: string;
}

export interface CompatibleCar {
  id: number;
  brand: string;
  model: string;
  year: string;
  engineLevel1: string;
  engineLevel2: string;
}

export interface EquivalentPart {
  id: number;
  oeNumber: string;
  oeName: string;
  brand: string;
  originalPrice: number;
  unit: string;
}

export interface EcommerceListing {
  id: number;
  platform: 'Shopee' | 'Lazada' | 'Tiki' | 'TikTok Shop';
  salesCode: string;
  productName: string;
  description: string;
  unit: string;
  price: number;
  link: string;
}

export type TabType = 'specs' | 'cars' | 'equivalent' | 'replacement' | 'ecommerce';
