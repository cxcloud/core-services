export interface PaginatedResult {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: any[];
}
