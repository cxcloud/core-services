export interface PaginatedResult {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: any[];
}

export type ClientRequest = {
  uri: string;
  method: string;
  body?: string | Object;
  token?: string;
  headers?: {
    [key: string]: string;
  };
};

export type ClientCredentials = {
  clientId: string;
  clientSecret: string;
};

export type SdkConfig = {
  projectKey: string;
  admin: ClientCredentials;
  user: ClientCredentials;
  authHost: string;
  apiHost: string;
  verbose: boolean;
};
