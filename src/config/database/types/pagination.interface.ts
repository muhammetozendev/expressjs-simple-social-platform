import { Repository } from 'typeorm';

export interface IPaginationResponse<T> {
  /** Number of total records in the table */
  count: number;

  /** Number of total pages avilable */
  pageCount: number;

  /** Number of records per page */
  limit: number;

  /** Current page number */
  currentPage: number;

  /** Contents of the current page */
  data: T[];
}
