export default interface SearchParamsInterface {
  page?: string;
  category?: string;
  product?: string;
  verify?: string;
  safe?: string;
  sort?: string;
  size?: string;
  user?: string;
  [key: string]: any;
}
