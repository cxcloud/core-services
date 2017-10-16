import { execute, methods, services } from '../sdk';
import { Cart } from '../sdk/types/carts';

export namespace Carts {
  export function create(customer?: any): Promise<Cart> {
    return execute(services.carts, methods.POST, {
      currency: 'EUR'
    });
  }

  export function getById(cartId: string): Promise<Cart> {
    return execute(services.carts.byId(cartId), methods.GET);
  }
}
