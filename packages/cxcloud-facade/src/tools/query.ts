import { QueryOptions } from '@cxcloud/ct-types/common';

export function getDefaults(options: QueryOptions): QueryOptions {
  const {
    page = 1,
    perPage = 20,
    sortPath = 'createdAt',
    ascending = false
  } = options;
  return {
    page,
    perPage,
    sortPath,
    ascending
  };
}
