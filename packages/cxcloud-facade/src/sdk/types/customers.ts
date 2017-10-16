import { Address, Custom } from './common';

export interface Customer {
  id: string;
  version: number;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  password: string;
  addresses: Address[];
  defaultShippingAddressId: string;
  defaultBillingAddressId: string;
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  companyName: string;
  vatId: string;
  custom: Custom;
  createdAt: Date;
  lastModifiedAt: Date;
  lastMessageSequenceNumber: number;
}
