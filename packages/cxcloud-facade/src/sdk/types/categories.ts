import { LocalizedString, Reference } from './common';
import { PaginatedResult } from './sdk';

export interface Category {
  id: string;
  version: number;
  name: LocalizedString;
  slug: LocalizedString;
  description: LocalizedString;
  ancestors: Reference[];
  orderHint: string;
  createdAt: Date;
  lastModifiedAt: Date;
  assets: any[];
  lastMessageSequenceNumber: number;
  parent: Reference;
  subCategories?: Category[];
}

export interface PaginatedCategoryResult extends PaginatedResult {
  results: Category[];
}
