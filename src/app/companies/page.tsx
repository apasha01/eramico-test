import React from "react";
import { Typography } from "@mui/material";
import IndividualCompany from "./individual-company";
import CategoryFilters from "../../Components/common/category-filters";
import { axiosInstance, getServerAxiosConfig } from "@/Helpers/axiosInstance";
import { CATEGORY_LOOKUP_TREE, COMPANY_LIST_PRIVATE } from "@/lib/urls";
import Pagination from "@/Components/common/pagination";
import VerificationFilters from "@/Components/common/verification-filters";
import { MyCustomBuildUrl } from "@/Helpers/Utilities";
import SearchParamsInterface from "@/Helpers/Interfaces/SearchParamsInterface";
import TitleFilters from "./filter/TitleFilter";
import CompanyDatePicker from "./filter/CompanyDatePicker";
import { Metadata } from "next";
import { GetMetadata } from "@/lib/metadata";
import PageHeader from "@/Components/common/page-header";
import SortOptions from "@/Components/common/sort-options";
import SortProps from "@/Helpers/Interfaces/SortProps";
interface SearchParamsProps {
  searchParams: Promise<SearchParamsInterface>;
}

export const metadata: Metadata = GetMetadata("شرکت‌ها");

export default async function Page(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams?.page ?? 1);

  const url = MyCustomBuildUrl(COMPANY_LIST_PRIVATE, searchParams, false);
  const response = await axiosInstance.get<any>(
    url,
    await getServerAxiosConfig()
  );
  const categoryResponse = await axiosInstance.get<any>(
    CATEGORY_LOOKUP_TREE,
    await getServerAxiosConfig()
  );
  const categories = categoryResponse?.data?.data || [];
  const total = response?.data?.total || 0;
  const companies = response?.data?.data || [];
  const sortProps: SortProps = {
    url: "/companies",
    searchParams: searchParams,
    defaultSelected: "new",
    hasAlphabeticalOptions: true,
    hasCreatedDateOption: true,
    hasMostAdvertiseOption: true,
    hasSuggestionOption: false,
    hasLastModifiedDateOption: false,
  };
  return (
    <div className="mainStyle" dir="rtl">
      <PageHeader
        title="شرکت‌ها"
        total={total ?? 0}
        singleTitle="شرکت"
        filterUrl="/companies/filter"
        sortProps={sortProps}
      />
      <div className="dividerStyle">
        <div className="listCategoryStyle">
          <CategoryFilters
            categories={categories}
            url="/companies"
            title="انتخاب دسته شرکت‌ها"
            hideChildren
            searchParams={searchParams}
          >
            <CompanyDatePicker
              title="جستجو بر اساس نام"
              searchParams={searchParams}
            />

            <VerificationFilters
              url="/companies"
              title="اعتبار شرکت"
              hideUser
              searchParams={searchParams}
            />
          </CategoryFilters>
        </div>
        {companies.length > 0 ? (
          <div className="mx d-flex align-items-center justify-content-center w-100 flex-column me-4">
            <SortOptions {...sortProps} />
            {companies.map((item: any) => (
              <IndividualCompany
                key={item.id}
                id={item.id}
                name={item.title}
                isFollowed={item.isFollowed}
                isVerified={item.isVerified}
                membershipPeriod={item.membershipPeriod}
                followerCount={item.followerCount}
                shortIntroduction={item.shortIntroduction || ""}
                avatar={item.avatar}
                code={item.code}
                isSafe={item.isSafe}
                subscriptionAvatar={item.subscriptionAvatar}
              />
            ))}
            <Pagination
              currentPage={pageNumber}
              count={total}
              url="/companies"
              searchParams={searchParams}
            />
          </div>
        ) : (
          <div
            className="container px-0 rounded-4 p-0 AdvertisementBG sellAdvertisement"
            style={{
              minHeight: "150px",
              maxWidth: "864px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginTop: "60px",
            }}
          >
            <Typography className="fs-24 fw-500">
              متأسفانه شرکت‌ پیدا نشد
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
