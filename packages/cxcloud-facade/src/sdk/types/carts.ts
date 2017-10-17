import { Address, Custom, LocalizedString, Money, Price, Reference, TaxedPrice, TaxRate } from './common';
import { Discount, DiscountCode } from './discounts';
import { Variant } from './products';

export interface DiscountReference extends Reference {
  obj: Discount;
}

export interface IncludedDiscount {
  discount: DiscountReference;
  discountedAmount: Money;
}

export interface DiscountedPrice {
  value: Money;
  includedDiscounts: IncludedDiscount[];
}

export interface DiscountedPricePerQuantity {
  quantity: number;
  discountedPrice: DiscountedPrice;
}

export interface LineItemState {
  quantity: number;
  state: Reference;
}

export interface LineItem {
  id: string;
  productId: string;
  name: LocalizedString;
  productType: Reference;
  productSlug: LocalizedString;
  variant: Variant;
  price: Price;
  quantity: number;
  discountedPrice: DiscountedPrice;
  discountedPricePerQuantity: DiscountedPricePerQuantity[];
  taxRate: TaxRate;
  state: LineItemState[];
  priceMode: string;
  totalPrice: Money;
  taxedPrice: TaxedPrice;
  lineItemMode: string;
}

export interface ShippingRate {
  price: Money;
  tiers?: any[];
}

export interface ShippingInfo {
  shippingMethodName: string;
  price: Money;
  shippingRate: ShippingRate;
  taxRate: TaxRate;
  taxCategory: Reference;
  deliveries: any[];
  shippingMethod: Reference;
  taxedPrice: TaxedPrice;
  shippingMethodState: string;
}

export interface DiscountCodeReference extends Reference {
  obj: DiscountCode;
}

export interface CartDiscountCode {
  discountCode: DiscountCodeReference;
  state: string;
}

export interface CartBase {
  type: string;
  id: string;
  version: number;
  customerId: string;
  customerEmail: string;
  createdAt: string;
  lastModifiedAt: string;
  lineItems: LineItem[];
  totalPrice: Money;
  taxedPrice: TaxedPrice;
  shippingAddress: Address;
  billingAddress: Address;
  shippingInfo: ShippingInfo;
  customLineItems: any[];
  discountCodes: CartDiscountCode[];
  custom: Custom;
  inventoryMode: string;
  taxMode: string;
  taxRoundingMode: string;
}

export interface Cart extends CartBase {
  cartState: string;
  refusedGifts: any[];
}
