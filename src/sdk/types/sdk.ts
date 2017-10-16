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
