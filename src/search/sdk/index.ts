import * as algolia from 'algoliasearch';
import * as config from 'config';

let __client: algolia.AlgoliaClient;

export function getClient() {
  if (__client) {
    return __client;
  }
  __client = algolia(
    config.get<string>('algolia.applicationId'),
    config.get<string>('algolia.apiKey')
  );
  return __client;
}
