import { clientExecute, methods, getServices } from '../sdk';
import { PaginatedProductResult, Product } from '@cxcloud/ct-types/products';
import { QueryOptions } from '@cxcloud/ct-types/common';
import { getDefaults } from '../tools/query';

export namespace Products {
  export function findByCategoryId(
    categoryId: string,
    options: QueryOptions = {}
  ): Promise<PaginatedProductResult> {
    const { page, perPage, sortPath, ascending } = getDefaults(options);
    return clientExecute({
      uri: getServices()
        .productProjectionsSearch.filter(
          `categories.id:subtree("${categoryId}")`
        )
        .page(page)
        .perPage(perPage)
        .sort(sortPath, ascending)
        .build(),
      method: methods.GET
    });
  }

  export function findBySearchQuery(
    q: string,
    language = 'en',
    options: QueryOptions = {}
  ): Promise<PaginatedProductResult> {
    const { page, perPage, sortPath, ascending } = getDefaults(options);
    return clientExecute({
      uri: getServices()
        .productProjectionsSearch.text(q, language)
        .fuzzy(true)
        .page(page)
        .perPage(perPage)
        .sort(sortPath, ascending)
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
