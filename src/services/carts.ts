/**
 * @TODO:
 * - Add/Remove discount codes
 * - Update cart addresses if needed
 * - Show cart recommendations
 */
import * as config from 'config';

import { clientExecute, methods, services } from '../sdk';
import { Cart } from '../sdk/types/carts';
import { Customer } from '../sdk/types/customers';
import {
  getCustomerCurrency,
  getCustomerShippingAddress
} from '../tools/customers';
import { Orders } from './orders';

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
    return clientExecute({
      uri: services.carts.build(),
      method: methods.POST,
      body: params
    });
  }

  export function createFromOrder(orderId: string): Promise<Cart> {
    return Orders.findById(orderId).then(order => {
      return clientExecute({
        uri: services.carts.build(),
        method: methods.POST,
        body: {
          currency: order.totalPrice.currencyCode,
          customerId: order.customerId,
          customerEmail: order.customerEmail,
          shippingAddress: order.shippingAddress
        }
      }).then((cart: Cart) =>
        addLineItems(
          cart.id,
          cart.version,
          order.lineItems.map(li => ({
            productId: li.productId,
            variantId: li.variant.id,
            quantity: li.quantity
          }))
        )
      );
    });
  }

  export function findById(cartId: string): Promise<Cart> {
    return clientExecute({
      uri: services.carts.byId(cartId).build(),
      method: methods.GET
    });
  }

  export function updateByActions(
    cartId: string,
    cartVersion: number,
    actions: ICartAction | ICartAction[]
  ): Promise<Cart> {
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
    return clientExecute({
      uri: services.carts.byId(cartId).build(),
      method: methods.POST,
      body: {
        version: cartVersion,
        actions
      }
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
