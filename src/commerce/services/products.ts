import { clientExecute, methods, getServices } from '../sdk';
import { PaginatedProductResult, Product } from '@cxcloud/ct-types/products';

export namespace Products {
  export function findByCategoryId(
    categoryId: string
  ): Promise<PaginatedProductResult> {
    return clientExecute({
      uri: getServices()
        .productProjectionsSearch.filter(
          `categories.id:subtree("${categoryId}")`
        )
        .perPage(20)
        .build(),
      method: methods.GET
    });
  }

  export function findBySearchQuery(
    q: string,
    language = 'en'
  ): Promise<PaginatedProductResult> {
    return clientExecute({
      uri: getServices()
        .productProjectionsSearch.text(q, language)
        .fuzzy(true)
        .perPage(20)
        .build(),
      method: methods.GET
    });
  }

  export function findById(productId: string): Promise<Product> {
    return clientExecute({
      uri: getServices()
        .productProjections.byId(productId)
        .build(),
      method: methods.GET
    });
  }
}
