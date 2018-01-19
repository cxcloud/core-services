import {
  createClient,
  CreateClientParams,
  ContentfulClientApi
} from 'contentful';
import * as config from 'config';

let __client: ContentfulClientApi;

export function getClient() {
  if (__client) {
    return __client;
  }
  __client = createClient(
    config.get<CreateClientParams>('contentful.sdkConfig')
  );
  return __client;
}
