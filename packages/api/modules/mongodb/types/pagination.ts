export interface DBPaginatedResult<T> {
  data: T[];
  totalCount: number;
}
