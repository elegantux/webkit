import { PaginatedResponse } from '@lib/models/response';

export const getNextPageParam = (lastPage: PaginatedResponse<any>) =>
  // eslint-disable-next-line no-unsafe-optional-chaining
  lastPage?.data?.current_page < lastPage?.data?.last_page ? lastPage?.data?.current_page + 1 : undefined;
