import { clientExecute, clientProcess, methods, getServices } from '../sdk';
import { Category } from '@cxcloud/ct-types/categories';

interface CategoryMap {
  [id: string]: Category;
}

function nestify(categories: Category[]): Category[] {
  const rootCategories: Category[] = [];
  const catMap = categories.reduce(
    (map: CategoryMap, cat: Category) => {
      map[cat.id] = cat;
      return map;
    },
    {} as CategoryMap
  );

  categories.forEach(cat => {
    if (cat.parent) {
      const parent = catMap[cat.parent.id];
      parent.subCategories = parent.subCategories || [];
      parent.subCategories.push(cat);
    } else {
      rootCategories.push(cat);
    }
  });

  return rootCategories;
}

export namespace Categories {
  export function fetchAll(flat = false): Promise<Category[]> {
    return clientProcess<Category[]>({
      uri: getServices()
        .categories.perPage(100)
        .build(),
      method: methods.GET
    }).then(res => {
      if (flat === true) {
        return res;
      }
      return nestify(res);
    });
  }

  export function findById(categoryId: string): Promise<Category> {
    return clientExecute({
      uri: getServices()
        .categories.byId(categoryId)
        .build(),
      method: methods.GET
    });
  }
}
