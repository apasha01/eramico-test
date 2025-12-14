import React from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import SortOptions from "@/Components/common/sort-options";
import CategoryFilters from "@/Components/common/category-filters";
import VerificationFilters from "@/Components/common/verification-filters";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
import PageHeader from "@/Components/common/page-header";
import SortProps from "@/Helpers/Interfaces/SortProps";
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}

export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const sortProps: SortProps = {
    url: "/advertise",
    searchParams: searchParams,
    defaultSelected: "eranico",
    hasLastModifiedDateOption: true,
    hasSuggestionOption: true,
    hasMostVisitedOption: true,
  };
  return (
    <div className="mainStyle">
      <PageHeader
        title="آگهی‌ها"
        singleTitle="آگهی"
        total={0}
        sortProps={sortProps}
        filterUrl="advertise/filters"
      />
      <div className="dividerStyle" dir="rtl">
        <div className="listCategoryStyle">
          <CategoryFilters
            categories={[]}
            title="انتخاب دسته‌بندی آگهی‌ها"
            url="/advertise"
            searchParams={searchParams}
          >
            <VerificationFilters
              url="/advertise"
              title="اعتبار آگهی‌دهنده"
              searchParams={searchParams}
            />
          </CategoryFilters>
        </div>

        <div className="listStyle" style={{ gap: "40px" }}>
          <div className="mt-4">
            <LoaderComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
