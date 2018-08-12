import { clientProcess, methods, getServices } from '../sdk';
import { ShippingMethod } from '@cxcloud/ct-types/shipping';

export namespace Shipping {
  export function fetchMethods(): Promise<ShippingMethod[]> {
    return clientProcess({
      uri: getServices().shippingMethods.build(),
      method: methods.GET
    });
  }
}
