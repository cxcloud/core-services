import { execute, methods, services } from '../sdk';
import { PaginatedProductResult, Product } from '../sdk/types/products';

export namespace Products {
  export function findByCategoryId(categoryId: string): Promise<PaginatedProductResult> {
    const query = services.productProjectionsSearch.filter(`categories.id:subtree("${categoryId}")`).perPage(20);
    return execute(query, methods.GET);
  }

  export function findBySearchQuery(q: string, language = 'en'): Promise<PaginatedProductResult> {
    const query = services.productProjectionsSearch
      .text(q, language)
      .fuzzy(true)
      .perPage(20);
    return execute(query, methods.GET);
  }

  export function findById(productId: string): Promise<Product> {
    const query = services.productProjections.byId(productId);
    return execute(query, methods.GET);
  }
}
