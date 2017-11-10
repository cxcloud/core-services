import { Cart } from './carts';
import { Address, Custom, Reference } from './common';

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
  tokenType: string;
}

export interface EncryptedTokenData {
  authToken: string;
  customerId: string;
  isAnonymous: boolean;
}

export interface TokenizedSignInResult {
  customer: Customer;
  token: OAuthToken;
  cart: Cart | null;
}

export interface AnonymousSignInResult {
  anonymousId: string;
  token: OAuthToken;
}

export interface CustomerSignupDraft {
  customerNumber?: string;
  key?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  salutation?: string;
  anonymousCartId?: string;
  anonymousId?: string;
  externalId?: string;
  dateOfBirth?: string;
  companyName?: string;
  vatId?: string;
  isEmailVerified?: boolean;
  customerGroup?: Reference;
  addresses?: Address[];
  defaultBillingAddress?: number;
  billingAddresses?: number[];
  defaultShippingAddress?: number;
  shippingAddresses?: number[];
  custom?: Custom;
  locale?: any; // @TODO: locale support
}
