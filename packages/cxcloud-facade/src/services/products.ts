import { execute, methods, services } from '../sdk';
import { PaginatedResult } from '../sdk/types/result';

export namespace Products {
  export function fetchAll(): Promise<PaginatedResult> {
    return execute(services.products.perPage(20), methods.GET);
  }
}
