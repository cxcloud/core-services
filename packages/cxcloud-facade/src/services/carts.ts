import { execute, methods, services } from '../sdk';
import { Cart } from '../sdk/types/carts';
import { Customer } from '../sdk/types/customers';

export namespace Carts {
  export function create(customer?: Customer): Promise<Cart> {
    return execute(services.carts, methods.POST, {
      currency: 'EUR'
    });
  }

  export function getById(cartId: string): Promise<Cart> {
    return execute(services.carts.byId(cartId), methods.GET);
  }
}
