import { Attribute, Image, LocalizedString, Price, Reference } from './common';
import { PaginatedResult } from './sdk';

export interface CategoryOrderHints {}

export interface Variant {
  id: number;
  sku: string;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
  assets: any[];
}

export interface SearchKeywords {}

export interface Product {
  id: string;
  version: number;
  productType: Reference;
  name: LocalizedString;
  categories: Reference[];
  categoryOrderHints: CategoryOrderHints;
  slug: LocalizedString;
  masterVariant: Variant;
  variants: Variant[];
  searchKeywords: SearchKeywords;
  hasStagedChanges: boolean;
  published: boolean;
  taxCategory: Reference;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface PaginatedProductResult extends PaginatedResult {
  results: Product[];
}
