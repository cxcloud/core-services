/**
 * @TODO:
 * - Create Order
 */
import { clientExecute, methods, services } from '../sdk';
import { Order, PaginatedOrderResult } from '../sdk/types/orders';

export namespace Orders {
  export function findByCustomerId(
    customerId: string
  ): Promise<PaginatedOrderResult> {
    return clientExecute({
      uri: services.orders
        .where(`customerId="${customerId}"`)
        .perPage(20)
        .build(),
      method: methods.GET
    });
  }

  export function findById(orderId: string): Promise<Order> {
    return clientExecute({
      uri: services.orders.byId(orderId).build(),
      method: methods.GET
    });
  }
}
