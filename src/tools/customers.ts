import * as config from 'config';
import { getCurrency } from 'locale-currency';

import { Address } from '@cxcloud/ct-types/common';
import { Customer } from '@cxcloud/ct-types/customers';

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
  if (address === undefined) {
    return defaultCurrency;
  }
  const currency = getCurrency(address.country);
  if (currencies.indexOf(currency) === -1) {
    return defaultCurrency;
  }
  return currency;
}
