import { clientProcess, methods, services } from '../sdk';
import { ShippingMethod } from '../sdk/types/shipping';

export namespace Shipping {
  export function fetchMethods(): Promise<ShippingMethod[]> {
    return clientProcess({
      uri: services.shippingMethods.build(),
      method: methods.GET
    });
  }
}
