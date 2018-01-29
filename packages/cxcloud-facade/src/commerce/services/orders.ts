import { getTokenData } from '../../tools/crypto';
import { clientExecute, methods, getServices } from '../sdk';
import {
  Order,
  PaginatedOrderResult,
  OrderUpdateAction
} from '@cxcloud/ct-types/orders';

export namespace Orders {
  export function fetchAll(
    token: string,
    isAdmin = false
  ): Promise<PaginatedOrderResult> {
    const service = isAdmin ? getServices().orders : getServices().myOrders;
    if (!isAdmin) {
      token = getTokenData(token).authToken;
    }
    return clientExecute({
      uri: service.perPage(20).build(),
      method: methods.GET,
      token
    });
  }

  export function findById(orderId: string, token: string): Promise<Order> {
    const { authToken } = getTokenData(token);
    return clientExecute({
      uri: getServices()
        .myOrders.byId(orderId)
        .build(),
      method: methods.GET,
      token: authToken
    });
  }

  export function create(
    cartId: string,
    cartVersion: number,
    orderNumber: string | null,
    token: string
  ): Promise<Order> {
    const { authToken, isAnonymous } = getTokenData(token);

    if (isAnonymous) {
      return Promise.reject(
        new Error('Refusing to create an order anonymously.')
      );
    }

    return clientExecute({
      uri: getServices().myOrders.build(),
      method: methods.POST,
      token: authToken,
      body: {
        id: cartId,
        version: cartVersion,
        orderNumber
      }
    });
  }

  export function update(
    orderId: string,
    orderVersion: number,
    actions: OrderUpdateAction[],
    token: string
  ): Promise<Order> {
    return clientExecute({
      uri: getServices()
        .orders.byId(orderId)
        .build(),
      method: methods.POST,
      token,
      body: {
        version: orderVersion,
        actions
      }
    });
  }
}
