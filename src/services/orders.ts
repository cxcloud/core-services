/**
 * @TODO:
 * - Create Order
 */
import { execute, methods, services } from '../sdk';
import { PaginatedOrderResult } from '../sdk/types/orders';

export namespace Orders {
  export function findByCustomerId(
    customerId: string
  ): Promise<PaginatedOrderResult> {
    return execute(
      services.orders.where(`customerId="${customerId}"`).perPage(20),
      methods.GET
    );
  }
}
