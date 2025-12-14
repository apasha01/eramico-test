import { ReadonlyURLSearchParams } from "next/navigation";

export default interface SortProps {
  url: string;
  searchParams: ReadonlyURLSearchParams | Record<string, string | string[]>;
  defaultSelected?: string;
  queryStringName?: string;
  hasSuggestionOption?: boolean;
  hasAlphabeticalOptions?: boolean;
  hasMostAdvertiseOption?: boolean;
  hasMostVisitedOption?: boolean;
  hasLastModifiedDateOption?: boolean;
  hasCreatedDateOption?: boolean;
}