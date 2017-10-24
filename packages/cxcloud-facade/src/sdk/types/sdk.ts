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
  headers?: {
    [key: string]: string;
  };
};

export type SdkConfig = {
  projectKey: string;
  clientId: string;
  clientSecret: string;
  authHost: string;
  apiHost: string;
};
