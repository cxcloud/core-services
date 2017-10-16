import * as config from 'config';

import { Address } from '../sdk/types/common';
import { Customer } from '../sdk/types/customers';

const { getCurrency } = require('locale-currency');

export function getCustomerBillingAddress(
  customer: Customer
): Address | undefined {
  if (
    !customer.defaultBillingAddressId &&
    customer.billingAddressIds.length === 0
  ) {
    return;
  }
  const addressId = customer.defaultBillingAddressId
    ? customer.defaultBillingAddressId
    : customer.billingAddressIds[0];
  return customer.addresses.find(address => address.id === addressId);
}

export function getCustomerShippingAddress(
  customer: Customer
): Address | undefined {
  if (
    !customer.defaultShippingAddressId &&
    customer.shippingAddressIds.length === 0
  ) {
    return;
  }
  const addressId = customer.defaultShippingAddressId
    ? customer.defaultShippingAddressId
    : customer.shippingAddressIds[0];
  return customer.addresses.find(address => address.id === addressId);
}

export function getCustomerCurrency(customer: Customer): string {
  const currencies = config.get<string[]>('store.supportedCurrencies');
  const defaultCurrency = config.get<string>('store.defaultCurrency');
  const address = getCustomerShippingAddress(customer);
  console.log(address);
  if (address === undefined) {
    return defaultCurrency;
  }
  const currency: string = getCurrency(address.country);
  if (currencies.indexOf(currency) === -1) {
    return defaultCurrency;
  }
  return currency;
}
