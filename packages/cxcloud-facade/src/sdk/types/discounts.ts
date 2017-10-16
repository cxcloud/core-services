import { LocalizedString, Reference } from './common';

export interface Target {
  type: string;
  predicate: string;
}

export interface DiscountValue {
  type: string;
  permyriad: number;
}

export interface DiscountCode {
  id: string;
  version: number;
  code: string;
  name: LocalizedString;
  description: LocalizedString;
  cartDiscounts: Reference[];
  isActive: boolean;
  references: any[];
  attributeTypes: any;
  cartFieldTypes: any;
  lineItemFieldTypes: any;
  customLineItemFieldTypes: any;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface Discount {
  id: string;
  version: number;
  value: DiscountValue;
  cartPredicate: string;
  target: Target;
  name: LocalizedString;
  description: LocalizedString;
  isActive: boolean;
  requiresDiscountCode: boolean;
  sortOrder: string;
  references: any[];
  attributeTypes: any;
  cartFieldTypes: any;
  lineItemFieldTypes: any;
  customLineItemFieldTypes: any;
  createdAt: Date;
  lastModifiedAt: Date;
}
