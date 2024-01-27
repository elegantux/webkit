export interface Response<T> {
  data: T;
  status: string;
}

export interface PaginatedResponse<T> {
  data: {
    data: T;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  status: string;
}

export interface SearchParams {
  page?: number;
  per_page?: number;
  sort?: 'ASC' | 'DESC';
  order?: string;
  keyword?: string;
}
