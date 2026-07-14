export interface PaginatedResponse<T> {
  data: T[];
  total_count: number;
}
