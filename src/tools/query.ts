import { QueryOptions } from '@cxcloud/ct-types/common';

export function getDefaults(options: QueryOptions): QueryOptions {
  return {
    page: 1,
    perPage: 20,
    sortPath: 'createdAt',
    ascending: false,
    ...options
  };
}
