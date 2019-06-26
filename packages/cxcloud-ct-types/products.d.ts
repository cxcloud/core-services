import {
  Attribute,
  Image,
  LocalizedString,
  Price,
  Reference,
  PriceDraft,
  Custom,
  Dimensions
} from './common';
import { PaginatedResult } from './sdk';

export interface CategoryOrderHints {}

export interface Variant {
  id: number;
  sku: string;
  key: string;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
  assets: Asset[];
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
  state: Reference;
}

export interface PaginatedProductResult extends PaginatedResult {
  results: Product[];
}

export interface ProductDraft {
  productType: Reference;
  variants: VariantDraft[];
  name: LocalizedString;
  description: LocalizedString;
  slug: LocalizedString;
  key: string;
  taxCategory: Reference;
  masterVariant: VariantDraft;
  categories?: Reference[];
  state?: Reference;
}

export interface VariantDraft {
  sku: string;
  key: string;
  attributes: Attribute[];
  images: Image[];
  prices: PriceDraft[];
  assets?: AssetDraft[];
}

export interface ProductUpdateAction {
  action: string;
  [key: string]: any;
}

export interface Asset extends AssetDraft {
  id: string;
}

export interface AssetDraft {
  key?: string;
  sources: AssetSource[];
  name: LocalizedString;
  description?: LocalizedString;
  tags?: string[];
  custom?: Custom;
}

export interface AssetSource {
  uri: string;
  key?: string;
  dimensions?: Dimensions;
  contentType?: string;
}
