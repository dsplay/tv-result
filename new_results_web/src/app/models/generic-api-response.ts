export interface IGenericApiResponse {
  total?: number;
  perPage?: number;
  page?: number;
  lastPage?: number;
  data?: any;
  rows?: any[];
  isOne?: boolean;
  pages?: {
    total?: number;
    perPage?: number;
    page?: number;
    lastPage?: number;
  };
}
