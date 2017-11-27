export interface LocalizedString {
  en: string;
}

export interface Reference {
  typeId: string;
  id: string;
}

export interface Money {
  currencyCode: string;
  centAmount: number;
}

export interface Price {
  value: Money;
  id: string;
}

export interface Attribute {
  name: string;
  value: any;
}

export interface Dimensions {
  w: number;
  h: number;
}

export interface Image {
  url: string;
  dimensions: Dimensions;
}
export interface Custom {
  type: Reference;
  fields: any;
}

export interface TaxRate {
  name: string;
  amount: number;
  includedInPrice: boolean;
  country: string;
  id: string;
  subRates: any[];
}

export interface TaxedPrice {
  totalNet: Money;
  totalGross: Money;
  taxPortions?: TaxPortion[];
}

export interface TaxPortion {
  rate: number;
  amount: Money;
  name: string;
}

export interface Address {
  id?: string;
  title?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  streetName?: string;
  streetNumber?: string;
  additionalStreetInfo?: string;
  postalCode: string;
  city: string;
  region?: string;
  state?: string;
  country: string;
  company?: string;
  department?: string;
  building?: string;
  apartment?: string;
  pOBox?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  fax?: string;
  additionalAddressInfo?: string;
  externalId?: string;
}
