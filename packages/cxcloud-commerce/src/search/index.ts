import {
  QueryParameters as AlgoliaQueryParameters,
  Response
} from 'algoliasearch';
import { getClient } from './sdk';

export namespace Search {
  export type QueryParams = AlgoliaQueryParameters;
  export function searchIndex(
    indexName: string,
    params: AlgoliaQueryParameters
  ): Promise<Response> {
    const index = getClient().initIndex(indexName);
    return index.search(params);
  }
}
