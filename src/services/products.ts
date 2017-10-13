import { execute, methods, services } from '../sdk';
import { PaginatedResult } from '../sdk/types/result';

export namespace Products {
  export function getProductsByCategoryId(categoryId: string): Promise<PaginatedResult> {
    const query = services.productProjectionsSearch.filter(`categories.id:subtree("${categoryId}")`).perPage(20);
    return execute(query, methods.GET);
  }

  export function getProductsBySearchQuery(q: string, language = 'en'): Promise<PaginatedResult> {
    const query = services.productProjectionsSearch
      .text(q, language)
      .fuzzy(true)
      .perPage(20);
    return execute(query, methods.GET);
  }

  export function getProductById(productId: string): Promise<any> {
    const query = services.products.byId(productId);
    return execute(query, methods.GET);
  }
}
