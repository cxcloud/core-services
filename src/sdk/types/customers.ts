import { Cart } from './carts';
import { Address, Custom } from './common';

export interface Customer {
  id: string;
  version: number;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  password?: string;
  addresses: Address[];
  defaultShippingAddressId: string;
  defaultBillingAddressId: string;
  shippingAddressIds: string[];
  billingAddressIds: string[];
  isEmailVerified: boolean;
  companyName: string;
  vatId: string;
  custom: Custom;
  createdAt: string;
  lastModifiedAt: string;
  lastMessageSequenceNumber: number;
}

export interface CustomerSignInResult {
  customer: Customer;
  cart?: Cart;
}

export interface OAuthToken {
  access_token: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  tokenType: 'Bearer';
}

export interface SignInResult {
  customer: Customer;
  token: OAuthToken;
  cart: Cart | null;
}
