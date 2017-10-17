import * as config from 'config';

import { execute, methods, services } from '../sdk';
import { Cart } from '../sdk/types/carts';
import { Customer } from '../sdk/types/customers';
import { getCustomerCurrency, getCustomerShippingAddress } from '../tools/customers';

export namespace Carts {
  export interface ICartAction {
    action: string;
    [key: string]: any;
  }

  export interface IAddLineItem {
    productId: string;
    variantId: number;
    quantity: number;
  }

  export interface IChangeLineItemQuantity {
    lineItemId: string;
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

  export function updateByActions(
    cartId: string,
    cartVersion: number,
    actions: ICartAction | ICartAction[]
  ): Promise<Cart> {
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
    return execute(services.carts.byId(cartId), methods.POST, {
      version: cartVersion,
      actions
    });
  }

  export function addLineItems(
    cartId: string,
    cartVersion: number,
    lineItems: IAddLineItem | IAddLineItem[]
  ): Promise<Cart> {
    if (!Array.isArray(lineItems)) {
      lineItems = [lineItems];
    }
    return updateByActions(
      cartId,
      cartVersion,
      lineItems.map(li => ({
        action: 'addLineItem',
        ...li
      }))
    );
  }

  export function changeLineItemQuantity(
    cartId: string,
    cartVersion: number,
    action: IChangeLineItemQuantity
  ): Promise<Cart> {
    return updateByActions(cartId, cartVersion, [
      {
        action: 'changeLineItemQuantity',
        ...action
      }
    ]);
  }

  export function removeLineItem(
    cartId: string,
    cartVersion: number,
    lineItemId: string
  ): Promise<Cart> {
    return updateByActions(cartId, cartVersion, [
      {
        action: 'removeLineItem',
        lineItemId
      }
    ]);
  }
}
