/**
 * @TODO:
 * - Create Order
 */
import { getTokenData } from '../tools/crypto';
import { clientExecute, methods, services } from '../sdk';
import { Order, PaginatedOrderResult } from '../sdk/types/orders';

export namespace Orders {
  export function fetchAll(token: string): Promise<PaginatedOrderResult> {
    const { authToken } = getTokenData(token);
    return clientExecute({
      uri: services.myOrders.perPage(20).build(),
      method: methods.GET,
      token: authToken
    });
  }

  export function findById(orderId: string, token: string): Promise<Order> {
    const { authToken } = getTokenData(token);
    return clientExecute({
      uri: services.myOrders.byId(orderId).build(),
      method: methods.GET,
      token: authToken
    });
  }
}
