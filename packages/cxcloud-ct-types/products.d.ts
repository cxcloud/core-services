import { Attribute, Image, LocalizedString, Price, Reference } from './common';
import { PaginatedResult } from './sdk';

export interface CategoryOrderHints {}

export interface Variant {
  id: number;
  sku: string;
  key: string;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
  assets: any[];
}

export interface SearchKeywords {}

export interface Product {
  id: string;
  version: number;
  key: string;
  productType: Reference;
  name: LocalizedString;
  description: LocalizedString;
  categories: Reference[];
  categoryOrderHints: CategoryOrderHints;
  slug: LocalizedString;
  masterVariant: Variant;
  variants: Variant[];
  searchKeywords: SearchKeywords;
  hasStagedChanges: boolean;
  published: boolean;
  taxCategory: Reference;
  createdAt: string;
  lastModifiedAt: string;
}

export interface PaginatedProductResult extends PaginatedResult {
  results: Product[];
}
