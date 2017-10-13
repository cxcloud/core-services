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
