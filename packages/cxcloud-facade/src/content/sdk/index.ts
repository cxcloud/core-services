import {
  createClient,
  CreateClientParams,
  ContentfulClientApi
} from 'contentful';
import * as config from 'config';

export const client: ContentfulClientApi = createClient(
  config.get<CreateClientParams>('contentful.sdkConfig')
);
