/**
 * @TODO:
 * - Add/Remove discount codes
 */
import * as config from 'config';

import { clientExecute, methods, services } from '../sdk';
import {
  Cart,
  IAddLineItem,
  ICartAction,
  IChangeLineItemQuantity
} from '@cxcloud/ct-types/carts';
import { Address, Reference } from '@cxcloud/ct-types/common';
import {
  getCustomerCurrency,
  getCustomerShippingAddress
} from '../tools/customers';
import { getTokenData } from '../tools/crypto';
import { Orders } from './orders';
import { Customers } from './customers';

export namespace Carts {
  export async function create(token: string): Promise<Cart> {
    const { customerId, authToken, isAnonymous } = getTokenData(token);

    let params: any = {
      currency: config.get<string>('store.defaultCurrency')
    };

    if (!isAnonymous) {
      const customer = await Customers.findById(customerId);
      params = {
        ...params,
        customerEmail: customer.email,
        currency: getCustomerCurrency(customer),
        shippingAddress: getCustomerShippingAddress(customer)
      };
    }

    return clientExecute<Cart>({
      uri: services.myCarts.build(),
      method: methods.POST,
      body: params,
      token: authToken
    });
  }

  export function createFromOrder(
    orderId: string,
    token: string
  ): Promise<Cart> {
    return Orders.findById(orderId, token).then(order => {
      const { authToken } = getTokenData(token);
      return clientExecute({
        uri: services.myCarts.build(),
        method: methods.POST,
        token: authToken,
        body: {
          currency: order.totalPrice.currencyCode,
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
          })),
          token
        )
      );
    });
  }

  export function findById(cartId: string, token: string): Promise<Cart> {
    const { authToken } = getTokenData(token);
    return clientExecute({
      uri: services.myCarts.byId(cartId).build(),
      method: methods.GET,
      token: authToken
    });
  }

  export function updateByActions(
    cartId: string,
    cartVersion: number,
    actions: ICartAction | ICartAction[],
    token: string
  ): Promise<Cart> {
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
    const { authToken } = getTokenData(token);
    return clientExecute({
      uri: services.myCarts.byId(cartId).build(),
      method: methods.POST,
      token: authToken,
      body: {
        version:
          typeof cartVersion === 'string' ? Number(cartVersion) : cartVersion,
        actions
      }
    });
  }

  export function addLineItems(
    cartId: string,
    cartVersion: number,
    lineItems: IAddLineItem | IAddLineItem[],
    token: string
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
      })),
      token
    );
  }

  export function changeLineItemQuantity(
    cartId: string,
    cartVersion: number,
    action: IChangeLineItemQuantity,
    token: string
  ): Promise<Cart> {
    return updateByActions(
      cartId,
      cartVersion,
      [
        {
          action: 'changeLineItemQuantity',
          ...action
        }
      ],
      token
    );
  }

  export function removeLineItem(
    cartId: string,
    cartVersion: number,
    lineItemId: string,
    token: string
  ): Promise<Cart> {
    return updateByActions(
      cartId,
      cartVersion,
      [
        {
          action: 'removeLineItem',
          lineItemId
        }
      ],
      token
    );
  }

  export function setShippingAddress(
    cartId: string,
    cartVersion: number,
    address: Address,
    token: string
  ): Promise<Cart> {
    return updateByActions(
      cartId,
      cartVersion,
      {
        action: 'setShippingAddress',
        address
      },
      token
    );
  }

  export function setBillingAddress(
    cartId: string,
    cartVersion: number,
    address: Address,
    token: string
  ): Promise<Cart> {
    return updateByActions(
      cartId,
      cartVersion,
      {
        action: 'setBillingAddress',
        address
      },
      token
    );
  }

  export function setShippingMethod(
    cartId: string,
    cartVersion: number,
    shippingMethodId: string,
    token: string
  ): Promise<Cart> {
    const shippingMethod: Reference = {
      typeId: 'shipping-method',
      id: shippingMethodId
    };
    return updateByActions(
      cartId,
      cartVersion,
      {
        action: 'setShippingMethod',
        shippingMethod
      },
      token
    );
  }
}
