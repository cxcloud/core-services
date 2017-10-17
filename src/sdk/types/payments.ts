import { LocalizedString, Money, Reference } from './common';

export interface PaymentMethodInfo {
  paymentInterface: string;
  method: string;
  name: LocalizedString;
}

export interface PaymentStatus {}

export interface Transaction {
  id: string;
  timestamp: string;
  type: string;
  amount: Money;
  state: string;
}

export interface Payment {
  id: string;
  version: number;
  customer: Reference;
  amountPlanned: Money;
  amountAuthorized: Money;
  paymentMethodInfo: PaymentMethodInfo;
  paymentStatus: PaymentStatus;
  transactions: Transaction[];
  interfaceInteractions: any[];
  createdAt: string;
  lastModifiedAt: string;
  lastMessageSequenceNumber: number;
}
