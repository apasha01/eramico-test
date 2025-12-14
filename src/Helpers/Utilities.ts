import { VISIT_ENTITY } from "@/lib/urls";
import { axiosInstance } from "./axiosInstance";
import EntityTypeEnum from "./Enum/EntityTypeEnum";
import SearchParamsInterface from "./Interfaces/SearchParamsInterface";
import { PAGE_SIZE } from "@/lib/constants";
import VisitTypeEnum from "./Enum/VisitTypeEnum";
import SortProps from "./Interfaces/SortProps";
import SortItem from "./Interfaces/SortItem";
import { APP_NAME } from "@/lib/metadata";

export function capitalizeFirstLetter(data: string, IsForCustomRoute: boolean) {
  if (IsForCustomRoute) {
    return "/" + data.charAt(1).toUpperCase() + data.slice(2);
  } else {
    console.error("🚀 ~ capitalizeFirstLetter ~ data:", data);
    return data.charAt(0).toUpperCase() + data.slice(1);
  }
}

export function getQueryStringValue(
  queryString: string,
  key: string
): string | null {
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(key);
}

// Create url based on object properties for non empty pr null properties
export function createUrlFromObject(
  baseUrl: string,
  params: Record<string, any>
): string {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  if (queryString) {
    return baseUrl.includes("?")
      ? `${baseUrl}&${queryString}`
      : `${baseUrl}?${queryString}`;
  }

  return baseUrl;
}

/**
 * Builds a custom URL with the provided search parameters.
 *
 * @param baseUrl - The base URL to which the search parameters will be added.
 * @param searchParams - The search parameters to include in the URL.
 * @param hasCompanyAndUserVerifyTogether - Flag indicating if both company and user verification should be included.
 * @returns The constructed URL with the search parameters.
 */
export function MyCustomBuildUrl(
  baseUrl: string,
  searchParams: SearchParamsInterface,
  hasCompanyAndUserVerifyTogether: boolean = false,
  mostVisitApiQuery: string = "mostVisit"
): string {
  const queryParams = new URLSearchParams();

  // map long query keys to short ones
  const keyMap: Record<string, string> = {
    page: "Page",
    category: "CategoryId",
    product: "ProductId",
    verify: hasCompanyAndUserVerifyTogether
      ? "IsCompanyVerified"
      : "IsVerified",
    safe: "IsSafe",
    sort: "OrderField",
    desc: "OrderType",
    size: "Size",
    user: "IsUserVerified",
  };

  const valueMap: Record<string, any> = {
    page: (val: string) =>
      val && !isNaN(parseInt(val)) ? parseInt(val, 10) : "",
    category: (val: string) =>
      val && !isNaN(parseInt(val)) ? String(val) : "",
    product: (val: string) => (val && !isNaN(parseInt(val)) ? String(val) : ""),
    verify: (val: string) => (val === "1" ? `${true}` : null),
    safe: (val: string) => (val === "1" ? `${true}` : null),
    sort: (val: string) => {
      switch (val) {
        case "visit":
          return mostVisitApiQuery || "VisitCount";
        case "eranico":
          return "EranicoSuggestion";
        case "newest":
          return "Newest";
        case "most-advertise":
          return "MostAdvertise";
        default:
          return val;
      }
    },
    desc: (val: string) => (val === "1" ? "desc" : "asc"),
    size: (val: string) => (val ? parseInt(val, 10) : PAGE_SIZE),
    user: (val: string) => (val === "1" ? `${true}` : null),
  };

  function sortValueMapper(value: string): Record<string, string> | null {
    switch (value) {
      case "new":
        return { OrderField: "CreatedDate", OrderType: "desc" };
      case "old":
        return { OrderField: "CreatedDate", OrderType: "asc" };
      case "az":
        return { OrderField: "Title", OrderType: "asc" };
      case "za":
        return { OrderField: "Title", OrderType: "desc" };
      default:
        return null;
    }
  }

  Object.entries(searchParams).forEach(([key, value]) => {
    const queryKey = keyMap[key] ?? key;
    const queryValue = valueMap[key]?.(value) ?? value;

    if (queryValue !== null && queryValue !== undefined && queryValue !== "") {
      if (key === "sort") {
        const sortMapping = sortValueMapper(String(value));
        if (sortMapping) {
          Object.entries(sortMapping).forEach(([sortKey, sortValue]) => {
            queryParams.append(sortKey, sortValue);
          });
        } else queryParams.append(queryKey, String(queryValue));
      } else queryParams.append(queryKey, String(queryValue));
    }
  });

  const queryString = queryParams.toString();
  if (queryString) {
    return baseUrl.includes("?")
      ? `${baseUrl}&${queryString}`
      : `${baseUrl}?${queryString}`;
  }

  return baseUrl;
}

export function BuildUrlWithSearchParams(
  baseUrl: string,
  searchParams: SearchParamsInterface
): string {
  const queryParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  if (queryString) {
    return baseUrl.includes("?")
      ? `${baseUrl}&${queryString}`
      : `${baseUrl}?${queryString}`;
  }
  return baseUrl;
}

export async function saveEntityVisit(
  entityId?: string | Number,
  entityTypeId?: Number | EntityTypeEnum
) {
  if (!entityId || !entityTypeId) {
    return;
  }
  try {
    await axiosInstance.post<any>(
      `${VISIT_ENTITY}?EntityTypeId=${entityTypeId}&EntityId=${entityId}&VisitTypeId=${VisitTypeEnum.Visit}`
    );
  } catch {
    console.error("Error in Submitting entity visit");
  }
}

export async function saveEntityClick(
  entityId?: string | Number,
  entityTypeId?: Number | EntityTypeEnum
) {
  if (!entityId || !entityTypeId) {
    return;
  }
  try {
    await axiosInstance.post<any>(
      `${VISIT_ENTITY}?EntityTypeId=${entityTypeId}&EntityId=${entityId}&VisitTypeId=${VisitTypeEnum.Click}`
    );
  } catch {
    console.error("Error in Submitting entity visit");
  }
}

export function getSortOptionLabel({
  hasSuggestionOption = true,
  hasAlphabeticalOptions = false,
  hasMostAdvertiseOption = false,
  hasMostVisitedOption = true,
  hasLastModifiedDateOption = true,
  hasCreatedDateOption = false,
}: SortProps): SortItem[] {
  const items: SortItem[] = [];
  if (hasSuggestionOption)
    items.push({ label: "پیشنهاد " + APP_NAME, value: "eranico" });
  if (hasCreatedDateOption || hasLastModifiedDateOption)
    items.push({
      label: "جدید‌ترین",
      value: hasLastModifiedDateOption ? "newest" : "new",
    });
  if (hasCreatedDateOption) items.push({ label: "قدیمی‌ترین", value: "old" });
  if (hasMostVisitedOption)
    items.push({ label: "پربازدیدترین", value: "visit" });
  if (hasMostAdvertiseOption)
    items.push({ label: "بیشترین آگهی", value: "most-advertise" });

  if (hasAlphabeticalOptions) {
    items.push({ label: "آ تا ی", value: "az" });
    items.push({ label: "ی تا آ", value: "za" });
  }
  return items;
}
