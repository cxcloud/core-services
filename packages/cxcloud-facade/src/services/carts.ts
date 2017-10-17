import * as config from 'config';

import { execute, methods, services } from '../sdk';
import { Cart } from '../sdk/types/carts';
import { Customer } from '../sdk/types/customers';
import { getCustomerCurrency, getCustomerShippingAddress } from '../tools/customers';

export namespace Carts {
  export interface IAddLineItem {
    productId: string;
    variantId: number;
    quantity: number;
  }

  export function create(customer?: Customer): Promise<Cart> {
    let params: any = {
      currency: config.get<string>('store.defaultCurrency')
    };
    if (customer) {
      params = {
        ...params,
        customerId: customer.id,
        customerEmail: customer.email,
        currency: getCustomerCurrency(customer),
        shippingAddress: getCustomerShippingAddress(customer)
      };
    }
    return execute(services.carts, methods.POST, params);
  }

  export function getById(cartId: string): Promise<Cart> {
    return execute(services.carts.byId(cartId), methods.GET);
  }

  export function addLineItems(
    cartId: string,
    cartVersion: number,
    lineItems: IAddLineItem | IAddLineItem[]
  ): Promise<Cart> {
    if (!Array.isArray(lineItems)) {
      lineItems = [lineItems];
    }
    return execute(services.carts.byId(cartId), methods.POST, {
      version: cartVersion,
      actions: lineItems.map(li => ({
        action: 'addLineItem',
        ...li
      }))
    });
  }
}
