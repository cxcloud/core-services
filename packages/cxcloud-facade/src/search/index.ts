import { AlgoliaQueryParameters, AlgoliaResponse } from 'algoliasearch';
import { getClient } from './sdk';

export namespace Search {
  export type QueryParams = AlgoliaQueryParameters;
  export function searchIndex(
    indexName: string,
    params: AlgoliaQueryParameters
  ): Promise<AlgoliaResponse> {
    const index = getClient().initIndex(indexName);
    return index.search(params);
  }
}
