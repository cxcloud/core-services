import { CartBase, ShippingInfo } from './carts';
import { Reference, Address, TaxedPrice } from './common';
import { Payment } from './payments';
import { PaginatedResult } from './sdk';
import { State } from './states';

export interface StateReference extends Reference {
  obj: State;
}

export interface PaymentReference extends Reference {
  obj: Payment;
}

export interface PaymentInfo {
  payments: PaymentReference[];
}

export interface Order extends CartBase {
  orderNumber: string;
  customerGroup: Reference;
  orderState: string;
  syncInfo: any[];
  returnInfo: any[];
  state: StateReference;
  transactionFee: boolean;
  lastMessageSequenceNumber: number;
  cart: Reference;
  paymentInfo: PaymentInfo;
  taxedPrice: TaxedPrice;
  shippingAddress: Address;
  billingAddress: Address;
  shippingInfo: ShippingInfo;
}

export interface PaginatedOrderResult extends PaginatedResult {
  results: Order[];
}
