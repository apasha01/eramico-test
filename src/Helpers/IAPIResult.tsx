export interface IAPIResult<T> {
  success?: boolean;
  message?: string;
  token?: string;
  data: T | null;
  total?: number;
}
