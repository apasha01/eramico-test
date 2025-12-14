import React from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import CategoryFilters from "@/Components/common/category-filters";
import VerificationFilters from "@/Components/common/verification-filters";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
import PageHeader from "@/Components/common/page-header";
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}
export default async function page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="mainStyle">
      <PageHeader title="استعلام" />
      <div className="dividerStyle" dir="rtl">
        <div className="listCategoryStyle">
          <CategoryFilters
            categories={[]}
            title="انتخاب دسته‌بندی استعلام‌ها"
            url="/inquiries"
            searchParams={searchParams}
          >
            <VerificationFilters
              url="/inquiries"
              title="اعتبار استعلام‌دهنده"
              searchParams={searchParams}
            />
          </CategoryFilters>
        </div>

        <div className="listStyle px-2 px-lg-4" style={{ gap: "40px" }}>
          <div className="mt-4">
            <LoaderComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
