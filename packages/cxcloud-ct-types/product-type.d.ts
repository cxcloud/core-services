import { Reference, LocalizedString } from './common';

export interface ProductType {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: LastModifiedBy;
  createdBy: CreatedBy;
  name: string;
  description: string;
  classifier: string;
  attributes: ProductTypeAttribute[];
  key: string;
}

export interface ProductTypeAttribute {
  name: string;
  label: LocalizedString;
  inputTip: LocalizedString;
  isRequired: boolean;
  type: Type;
  attributeConstraint: string;
  isSearchable: boolean;
  inputHint: string;
  displayGroup: string;
}

interface Type {
  name: string;
  values: ValuesEntity[];
}

interface ValuesEntity {
  key: string;
  label: string;
}

interface LastModifiedBy {
  isPlatformClient: boolean;
  user: Reference;
}

interface CreatedBy {
  user: Reference;
}
