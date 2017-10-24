import { clientExecute, clientProcess, methods, services } from '../sdk';
import { Category } from '../sdk/types/categories';

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
    return clientProcess({
      uri: services.categories.perPage(100).build(),
      method: methods.GET
    }).then((res: Category[]) => {
      if (flat === true) {
        return res;
      }
      return nestify(res);
    });
  }

  export function findById(categoryId: string): Promise<Category> {
    // const query = services.categories.byId(categoryId);
    // return execute(query, methods.GET);
    return clientExecute({
      uri: services.categories.byId(categoryId).build(),
      method: methods.GET
    });
  }
}
