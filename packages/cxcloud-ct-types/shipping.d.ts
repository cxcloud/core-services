import { Money, Reference } from './common';

export interface ShippingRate {
  price: Money;
  freeAbove?: Money;
  tiers: any[];
}

export interface ZoneRate {
  zone: Reference;
  shippingRates: ShippingRate[];
}

export interface ShippingMethod {
  id: string;
  version: number;
  name: string;
  description: string;
  taxCategory: Reference;
  zoneRates: ZoneRate[];
  isDefault: boolean;
  createdAt: string;
  lastModifiedAt: string;
}
