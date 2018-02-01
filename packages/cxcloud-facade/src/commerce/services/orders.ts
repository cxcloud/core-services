import { getTokenData } from '../../tools/crypto';
import { getDefaults } from '../../tools/query';
import { clientExecute, methods, getServices } from '../sdk';
import { Order, PaginatedOrderResult } from '@cxcloud/ct-types/orders';
import { UpdateAction, QueryOptions } from '@cxcloud/ct-types/common';

export namespace Orders {
  export function fetchAll(
    token: string,
    isAdmin = false,
    options: QueryOptions = {}
  ): Promise<PaginatedOrderResult> {
    const { page, perPage, sortPath, ascending } = getDefaults(options);
    const service = isAdmin ? getServices().orders : getServices().myOrders;
    if (!isAdmin) {
      token = getTokenData(token).authToken;
    }
    return clientExecute({
      uri: service
        .page(page)
        .perPage(perPage)
        .sort(sortPath, ascending)
        .build(),
      method: methods.GET,
      token
    });
  }

  export function findById(
    orderId: string,
    token: string,
    isAdmin = false
  ): Promise<Order> {
    const service = isAdmin ? getServices().orders : getServices().myOrders;
    if (!isAdmin) {
      token = getTokenData(token).authToken;
    }
    return clientExecute({
      uri: service.byId(orderId).build(),
      method: methods.GET,
      token
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
    actions: UpdateAction[],
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

  export function remove(
    orderId: string,
    orderVersion: number,
    token: string
  ): Promise<Order> {
    return clientExecute({
      uri: getServices()
        .orders.byId(orderId)
        .withVersion(orderVersion)
        .build(),
      method: methods.DELETE,
      token
    });
  }
}
