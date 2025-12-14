import React from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import CategoryFilters from "../../Components/common/category-filters";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
import PageHeader from "@/Components/common/page-header";
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}
export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="mainStyle">
      <PageHeader title="شرکت‌ها" total={0} />
      <div className="dividerStyle" dir="rtl">
        <div className="listCategoryStyle">
          <CategoryFilters
            url="/companies"
            categories={[]}
            title="انتخاب دسته شرکت‌ها"
            searchParams={searchParams}
          />
        </div>

        <div className="listCompanyStyle" style={{ marginTop: "60px" }}>
          <LoaderComponent />
        </div>
      </div>
    </div>
  );
}
