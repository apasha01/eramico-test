import React from "react";
import LoaderComponent from "@/Components/LoaderComponent";
import OrderItem from "./orderItem";
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
      <PageHeader title="بازار و کالاها" total={0} />
      <div className="dividerStyle" dir="rtl">
        <div className="listCategoryStyle">
          <CategoryFilters
            url="/products"
            categories={[]}
            title="انتخاب دسته محصولات"
            searchParams={searchParams}
          />
        </div>

        <div className="listStyle" style={{ gap: "40px" }}>
          <OrderItem />
          <div className="mt-4">
            <LoaderComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
